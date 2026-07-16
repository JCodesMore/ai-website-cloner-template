;; Homepage copy - UTF-8 segments in linear memory for React host

(module
  (memory (export "memory") 1)

  ;; Layout (56 bytes total):
  ;;   0..31   before  "Clone target not yet built. Run "
  ;;  32..45   marker  "/clone-website"
  ;;  46..55   after   " to start."
  (data (i32.const 0)
    "Clone target not yet built. Run /clone-website to start.")

  (func (export "before_ptr") (result i32) (i32.const 0))
  (func (export "before_len") (result i32) (i32.const 32))
  (func (export "marker_ptr") (result i32) (i32.const 32))
  (func (export "marker_len") (result i32) (i32.const 14))
  (func (export "after_ptr") (result i32) (i32.const 46))
  (func (export "after_len") (result i32) (i32.const 10))

  (func (export "message_ptr") (result i32) (i32.const 0))
  (func (export "message_len") (result i32) (i32.const 56))
)
