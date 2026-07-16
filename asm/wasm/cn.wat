;; cn — class-name join + last-wins token dedupe (WebAssembly)
;;
;; Memory layout (caller-managed):
;;   [0 .. $in_len)     UTF-8 input: tokens separated by 0x00 (NUL)
;;   [HEAP .. )         scratch + output (NUL-terminated)
;;
;; Export:
;;   cn(in_ptr, in_len) -> out_ptr
;;   memory

(module
  (memory (export "memory") 1)

  ;; Fixed heap base — keeps input intact in low memory when JS writes at 0
  (global $heap (mut i32) (i32.const 32768))
  (global $out  (mut i32) (i32.const 0))

  (func $is_space (param $c i32) (result i32)
    (i32.or
      (i32.eq (local.get $c) (i32.const 32))
      (i32.or
        (i32.eq (local.get $c) (i32.const 9))
        (i32.or
          (i32.eq (local.get $c) (i32.const 10))
          (i32.eq (local.get $c) (i32.const 13))))))

  ;; Compare two byte ranges for equality
  (func $eq_range (param $a i32) (param $al i32) (param $b i32) (param $bl i32) (result i32)
    (local $i i32)
    (if (i32.ne (local.get $al) (local.get $bl))
      (then (return (i32.const 0))))
    (block $done
      (loop $cmp
        (br_if $done (i32.ge_u (local.get $i) (local.get $al)))
        (if (i32.ne
              (i32.load8_u (i32.add (local.get $a) (local.get $i)))
              (i32.load8_u (i32.add (local.get $b) (local.get $i))))
          (then (return (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $cmp)))
    (i32.const 1))

  ;; Append token [$t,$t+$tl) to output at $out, prefixed by space if needed.
  ;; Token table stored as pairs (ptr,len) at TABLE_BASE; count at TABLE_COUNT.
  (func $emit_token (param $t i32) (param $tl i32)
    (local $i i32)
    (local $count i32)
    (local $ep i32)
    (local $el i32)
    (local $obase i32)
    (local $op i32)

    (if (i32.eqz (local.get $tl)) (then (return)))

    (local.set $count (i32.load (i32.const 65520))) ;; table count
    (local.set $i (i32.const 0))
    ;; Mark earlier duplicates as len=0 (last-wins)
    (block $scan_done
      (loop $scan
        (br_if $scan_done (i32.ge_u (local.get $i) (local.get $count)))
        (local.set $ep (i32.load (i32.add (i32.const 49152) (i32.mul (local.get $i) (i32.const 8)))))
        (local.set $el (i32.load (i32.add (i32.const 49156) (i32.mul (local.get $i) (i32.const 8)))))
        (if (i32.and (local.get $el)
              (call $eq_range (local.get $ep) (local.get $el) (local.get $t) (local.get $tl)))
          (then
            (i32.store (i32.add (i32.const 49156) (i32.mul (local.get $i) (i32.const 8))) (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $scan)))

    ;; Push new table entry
    (i32.store (i32.add (i32.const 49152) (i32.mul (local.get $count) (i32.const 8))) (local.get $t))
    (i32.store (i32.add (i32.const 49156) (i32.mul (local.get $count) (i32.const 8))) (local.get $tl))
    (i32.store (i32.const 65520) (i32.add (local.get $count) (i32.const 1))))

  (func $rebuild_output
    (local $i i32)
    (local $count i32)
    (local $ep i32)
    (local $el i32)
    (local $op i32)
    (local $j i32)
    (local $first i32)

    (local.set $op (global.get $heap))
    (global.set $out (local.get $op))
    (local.set $count (i32.load (i32.const 65520)))
    (local.set $first (i32.const 1))
    (local.set $i (i32.const 0))

    (block $done
      (loop $each
        (br_if $done (i32.ge_u (local.get $i) (local.get $count)))
        (local.set $ep (i32.load (i32.add (i32.const 49152) (i32.mul (local.get $i) (i32.const 8)))))
        (local.set $el (i32.load (i32.add (i32.const 49156) (i32.mul (local.get $i) (i32.const 8)))))
        (if (local.get $el)
          (then
            (if (i32.eqz (local.get $first))
              (then
                (i32.store8 (local.get $op) (i32.const 32))
                (local.set $op (i32.add (local.get $op) (i32.const 1))))
              (else
                (local.set $first (i32.const 0))))
            (local.set $j (i32.const 0))
            (block $copy_done
              (loop $copy
                (br_if $copy_done (i32.ge_u (local.get $j) (local.get $el)))
                (i32.store8 (local.get $op)
                  (i32.load8_u (i32.add (local.get $ep) (local.get $j))))
                (local.set $op (i32.add (local.get $op) (i32.const 1)))
                (local.set $j (i32.add (local.get $j) (i32.const 1)))
                (br $copy)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $each)))
    (i32.store8 (local.get $op) (i32.const 0)))

  (func (export "cn") (param $ptr i32) (param $len i32) (result i32)
    (local $i i32)
    (local $start i32)
    (local $c i32)
    (local $end i32)

    ;; reset token table
    (i32.store (i32.const 65520) (i32.const 0))
    (local.set $i (local.get $ptr))
    (local.set $end (i32.add (local.get $ptr) (local.get $len)))
    (local.set $start (local.get $i))

    (block $outer_done
      (loop $outer
        (br_if $outer_done (i32.ge_u (local.get $i) (local.get $end)))
        (local.set $c (i32.load8_u (local.get $i)))
        (if (i32.or (i32.eqz (local.get $c)) (call $is_space (local.get $c)))
          (then
            (call $emit_token (local.get $start) (i32.sub (local.get $i) (local.get $start)))
            ;; skip separators
            (block $skip_done
              (loop $skip
                (br_if $skip_done (i32.ge_u (local.get $i) (local.get $end)))
                (local.set $c (i32.load8_u (local.get $i)))
                (br_if $skip_done
                  (i32.eqz (i32.or (i32.eqz (local.get $c)) (call $is_space (local.get $c)))))
                (local.set $i (i32.add (local.get $i) (i32.const 1)))
                (br $skip)))
            (local.set $start (local.get $i))
            (br $outer)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $outer)))

    ;; final token
    (call $emit_token (local.get $start) (i32.sub (local.get $i) (local.get $start)))
    (call $rebuild_output)
    (global.get $out))

  (func (export "out_len") (result i32)
    (local $p i32)
    (local $n i32)
    (local.set $p (global.get $out))
    (block $done
      (loop $l
        (br_if $done (i32.eqz (i32.load8_u (local.get $p))))
        (local.set $n (i32.add (local.get $n) (i32.const 1)))
        (local.set $p (i32.add (local.get $p) (i32.const 1)))
        (br $l)))
    (local.get $n))
)
