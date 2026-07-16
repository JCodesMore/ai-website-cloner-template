;; resolve-imports.wat — expand @path lines in AGENTS.md-style buffers

(module
  (memory (export "memory") 8)

  (global $out_len (mut i32) (i32.const 0))
  (func (export "out_len") (result i32) (global.get $out_len))

  ;; append_bytes(dst_base, dst_len, src, src_len) -> new_dst_len
  (func $append (param $dst i32) (param $dlen i32) (param $src i32) (param $slen i32) (result i32)
    (local $i i32)
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $slen)))
        (i32.store8
          (i32.add (local.get $dst) (i32.add (local.get $dlen) (local.get $i)))
          (i32.load8_u (i32.add (local.get $src) (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $L)))
    (i32.add (local.get $dlen) (local.get $slen)))

  ;; scan_at_line(src, len, line_start) -> 1 if line starts with '@' and has path
  (func $line_is_import (param $src i32) (param $start i32) (param $end i32) (result i32)
    (if (i32.ge_u (local.get $start) (local.get $end)) (then (return (i32.const 0))))
    (i32.eq (i32.load8_u (i32.add (local.get $src) (local.get $start))) (i32.const 64)))

  ;; copy_line_path: extract path after '@' into path_dst, return path_len (no CR)
  (func (export "extract_import_path")
    (param $src i32) (param $start i32) (param $end i32) (param $path_dst i32) (result i32)
    (local $i i32) (local $o i32) (local $c i32)
    (local.set $i (i32.add (local.get $start) (i32.const 1))) ;; skip @
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $end)))
        (local.set $c (i32.load8_u (i32.add (local.get $src) (local.get $i))))
        (if (i32.or
              (i32.eq (local.get $c) (i32.const 13))
              (i32.eq (local.get $c) (i32.const 10)))
          (then (br $done)))
        (i32.store8 (i32.add (local.get $path_dst) (local.get $o)) (local.get $c))
        (local.set $o (i32.add (local.get $o) (i32.const 1)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $L)))
    (local.get $o))

  ;; Helper exported for host-driven line iteration: find next newline
  (func (export "find_nl") (param $src i32) (param $start i32) (param $len i32) (result i32)
    (local $i i32)
    (local.set $i (local.get $start))
    (block $done
      (loop $L
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (if (i32.eq (i32.load8_u (i32.add (local.get $src) (local.get $i))) (i32.const 10))
          (then (return (local.get $i))))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $L)))
    (local.get $len))

  (func (export "is_import_line") (param $src i32) (param $start i32) (param $end i32) (result i32)
    (call $line_is_import (local.get $src) (local.get $start) (local.get $end)))

  ;; append region
  (func (export "append") (param $dst i32) (param $dlen i32) (param $src i32) (param $slen i32) (result i32)
    (local.set $dlen (call $append (local.get $dst) (local.get $dlen) (local.get $src) (local.get $slen)))
    (global.set $out_len (local.get $dlen))
    (local.get $dlen))
)
