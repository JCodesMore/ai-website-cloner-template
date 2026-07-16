;; sync-text.wat — string transforms for skill sync (WebAssembly)

(module
  (memory (export "memory") 8)

  (global $out_len (mut i32) (i32.const 0))
  (global $body_off (mut i32) (i32.const 0))
  (global $body_len (mut i32) (i32.const 0))

  (func (export "out_len") (result i32) (global.get $out_len))
  (func (export "body_off") (result i32) (global.get $body_off))
  (func (export "body_len") (result i32) (global.get $body_len))

  (func $eq (param $a i32) (param $b i32) (param $n i32) (result i32)
    (local $i i32)
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $n)))
        (if (i32.ne
              (i32.load8_u (i32.add (local.get $a) (local.get $i)))
              (i32.load8_u (i32.add (local.get $b) (local.get $i))))
          (then (return (i32.const 0))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $L)))
    (i32.const 1))

  (func $is_dash_line (param $src i32) (param $start i32) (param $end i32) (result i32)
    (if (i32.ne (i32.sub (local.get $end) (local.get $start)) (i32.const 3))
      (then (return (i32.const 0))))
    (i32.and
      (i32.eq (i32.load8_u (i32.add (local.get $src) (local.get $start))) (i32.const 45))
      (i32.and
        (i32.eq (i32.load8_u (i32.add (local.get $src) (i32.add (local.get $start) (i32.const 1)))) (i32.const 45))
        (i32.eq (i32.load8_u (i32.add (local.get $src) (i32.add (local.get $start) (i32.const 2)))) (i32.const 45)))))

  ;; normalize_lf(src, len, dst) -> new_len
  (func (export "normalize_lf") (param $src i32) (param $len i32) (param $dst i32) (result i32)
    (local $i i32) (local $o i32) (local $c i32)
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (local.set $c (i32.load8_u (i32.add (local.get $src) (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (if (i32.ne (local.get $c) (i32.const 13))
          (then
            (i32.store8 (i32.add (local.get $dst) (local.get $o)) (local.get $c))
            (local.set $o (i32.add (local.get $o) (i32.const 1)))))
        (br $L)))
    (global.set $out_len (local.get $o))
    (local.get $o))

  ;; find_body(src, len) -> 1/0 ; sets body_off / body_len
  (func (export "find_body") (param $src i32) (param $len i32) (result i32)
    (local $i i32) (local $seps i32) (local $line_start i32)
    (local.set $i (i32.const 0))
    (local.set $seps (i32.const 0))
    (local.set $line_start (i32.const 0))
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (if (i32.eq (i32.load8_u (i32.add (local.get $src) (local.get $i))) (i32.const 10))
          (then
            (if (call $is_dash_line (local.get $src) (local.get $line_start) (local.get $i))
              (then
                (local.set $seps (i32.add (local.get $seps) (i32.const 1)))
                (if (i32.eq (local.get $seps) (i32.const 2))
                  (then
                    (global.set $body_off (i32.add (local.get $i) (i32.const 1)))
                    (global.set $body_len (i32.sub (local.get $len) (i32.add (local.get $i) (i32.const 1))))
                    (return (i32.const 1))))))
            (local.set $line_start (i32.add (local.get $i) (i32.const 1)))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $L)))
    (i32.const 0))

  (func (export "replace_all")
    (param $src i32) (param $slen i32)
    (param $needle i32) (param $nlen i32)
    (param $repl i32) (param $rlen i32)
    (param $dst i32) (result i32)
    (local $i i32) (local $o i32) (local $j i32)
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $slen)))
        (if (i32.and
              (i32.le_u (i32.add (local.get $i) (local.get $nlen)) (local.get $slen))
              (call $eq (i32.add (local.get $src) (local.get $i)) (local.get $needle) (local.get $nlen)))
          (then
            (local.set $j (i32.const 0))
            (block $cd
              (loop $C
                (br_if $cd (i32.ge_u (local.get $j) (local.get $rlen)))
                (i32.store8 (i32.add (local.get $dst) (local.get $o))
                  (i32.load8_u (i32.add (local.get $repl) (local.get $j))))
                (local.set $o (i32.add (local.get $o) (i32.const 1)))
                (local.set $j (i32.add (local.get $j) (i32.const 1)))
                (br $C)))
            (local.set $i (i32.add (local.get $i) (local.get $nlen)))
            (br $L)))
        (i32.store8 (i32.add (local.get $dst) (local.get $o))
          (i32.load8_u (i32.add (local.get $src) (local.get $i))))
        (local.set $o (i32.add (local.get $o) (i32.const 1)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $L)))
    (global.set $out_len (local.get $o))
    (local.get $o))

  (func (export "json_escape") (param $src i32) (param $slen i32) (param $dst i32) (result i32)
    (local $i i32) (local $o i32) (local $c i32)
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $slen)))
        (local.set $c (i32.load8_u (i32.add (local.get $src) (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (if (i32.eq (local.get $c) (i32.const 92))
          (then
            (i32.store8 (i32.add (local.get $dst) (local.get $o)) (i32.const 92))
            (local.set $o (i32.add (local.get $o) (i32.const 1)))
            (i32.store8 (i32.add (local.get $dst) (local.get $o)) (i32.const 92))
            (local.set $o (i32.add (local.get $o) (i32.const 1)))
            (br $L)))
        (if (i32.eq (local.get $c) (i32.const 34))
          (then
            (i32.store8 (i32.add (local.get $dst) (local.get $o)) (i32.const 92))
            (local.set $o (i32.add (local.get $o) (i32.const 1)))
            (i32.store8 (i32.add (local.get $dst) (local.get $o)) (i32.const 34))
            (local.set $o (i32.add (local.get $o) (i32.const 1)))
            (br $L)))
        (if (i32.eq (local.get $c) (i32.const 10))
          (then
            (i32.store8 (i32.add (local.get $dst) (local.get $o)) (i32.const 92))
            (local.set $o (i32.add (local.get $o) (i32.const 1)))
            (i32.store8 (i32.add (local.get $dst) (local.get $o)) (i32.const 110))
            (local.set $o (i32.add (local.get $o) (i32.const 1)))
            (br $L)))
        (if (i32.eq (local.get $c) (i32.const 13)) (then (br $L)))
        (i32.store8 (i32.add (local.get $dst) (local.get $o)) (local.get $c))
        (local.set $o (i32.add (local.get $o) (i32.const 1)))
        (br $L)))
    (global.set $out_len (local.get $o))
    (local.get $o))
)
