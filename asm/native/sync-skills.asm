; sync-skills.asm — Windows x86-64 byte propagator for SKILL.md
; Format-aware transforms live in asm/wasm/sync-transform.wat (npm run sync:skills)
bits 64
default rel

section .text
global mainCRTStartup

extern GetStdHandle
extern WriteFile
extern CreateFileA
extern ReadFile
extern CloseHandle
extern GetFileSize
extern CreateDirectoryA
extern ExitProcess
extern GetModuleFileNameA
extern lstrlenA
extern GetProcessHeap
extern HeapAlloc
extern HeapFree

STD_OUTPUT_HANDLE equ -11
GENERIC_READ equ 80000000h
GENERIC_WRITE equ 40000000h
FILE_SHARE_READ equ 1
OPEN_EXISTING equ 3
CREATE_ALWAYS equ 2
FILE_ATTRIBUTE_NORMAL equ 80h
INVALID_HANDLE equ -1

DEST_COUNT equ 9
DEST_STRIDE equ 64

mainCRTStartup:
    and     rsp, -10h
    sub     rsp, 60h
    mov     ecx, STD_OUTPUT_HANDLE
    call    GetStdHandle
    mov     [rel hOut], rax
    lea     rcx, [rel msgBoot]
    call    puts
    xor     ecx, ecx
    lea     rdx, [rel modPath]
    mov     r8d, 512
    call    GetModuleFileNameA
    lea     rcx, [rel modPath]
    call    strip_leaf
    lea     rcx, [rel root]
    lea     rdx, [rel modPath]
    call    zcopy
    lea     rcx, [rel srcPath]
    lea     rdx, [rel root]
    call    zcopy
    lea     rcx, [rel srcPath]
    lea     rdx, [rel sep]
    call    zcat
    lea     rcx, [rel srcPath]
    lea     rdx, [rel srcRel]
    call    zcat
    lea     rcx, [rel srcPath]
    call    load_file
    test    rax, rax
    jz      .fail
    mov     [rel buf], rax
    xor     ebx, ebx
.loop:
    cmp     ebx, DEST_COUNT
    jge     .ok
    lea     rcx, [rel dstPath]
    lea     rdx, [rel root]
    call    zcopy
    lea     rcx, [rel dstPath]
    lea     rdx, [rel sep]
    call    zcat
    mov     eax, ebx
    imul    eax, DEST_STRIDE
    lea     rdx, [rel destTable]
    add     rdx, rax
    lea     rcx, [rel dstPath]
    call    zcat
    lea     rcx, [rel dstPath]
    call    mkparents
    lea     rcx, [rel dstPath]
    mov     rdx, [rel buf]
    mov     r8d, [rel bufLen]
    call    save_file
    lea     rcx, [rel msgWrote]
    call    puts
    lea     rcx, [rel dstPath]
    call    puts
    lea     rcx, [rel msgNl]
    call    puts
    inc     ebx
    jmp     .loop
.ok:
    lea     rcx, [rel msgDone]
    call    puts
    call    GetProcessHeap
    mov     rcx, rax
    xor     edx, edx
    mov     r8, [rel buf]
    call    HeapFree
    xor     ecx, ecx
    call    ExitProcess
.fail:
    lea     rcx, [rel msgFail]
    call    puts
    mov     ecx, 1
    call    ExitProcess

puts:
    push    rbx
    sub     rsp, 30h
    mov     rbx, rcx
    call    lstrlenA
    mov     rcx, [rel hOut]
    mov     rdx, rbx
    mov     r8d, eax
    lea     r9, [rel wrote]
    mov     qword [rsp+20h], 0
    call    WriteFile
    add     rsp, 30h
    pop     rbx
    ret
zcopy:
    push    rsi
    push    rdi
    mov     rdi, rcx
    mov     rsi, rdx
.zc: lodsb
    stosb
    test    al, al
    jnz     .zc
    pop     rdi
    pop     rsi
    ret
zcat:
    push    rsi
    push    rdi
    mov     rdi, rcx
    mov     rsi, rdx
.zf: cmp     byte [rdi], 0
    je      .zca
    inc     rdi
    jmp     .zf
.zca: lodsb
    stosb
    test    al, al
    jnz     .zca
    pop     rdi
    pop     rsi
    ret
strip_leaf:
    push    rbx
    mov     rbx, rcx
    call    lstrlenA
    mov     ecx, eax
    test    ecx, ecx
    jz      .sld
    dec     ecx
.sls: cmp     ecx, 0
    jl      .sld
    mov     al, [rbx+rcx]
    cmp     al, '\'
    je      .slc
    cmp     al, '/'
    je      .slc
    dec     ecx
    jmp     .sls
.slc: mov     byte [rbx+rcx], 0
.sld: pop     rbx
    ret
mkparents:
    push    rbx
    push    rsi
    sub     rsp, 28h
    mov     rsi, rcx
    lea     rcx, [rel dirScratch]
    mov     rdx, rsi
    call    zcopy
    lea     rbx, [rel dirScratch]
    cmp     byte [rbx+1], ':'
    jne     .mps
    add     rbx, 3
.mps: mov     al, [rbx]
    test    al, al
    jz      .mpd
    cmp     al, '\'
    je      .mpm
    cmp     al, '/'
    je      .mpm
    inc     rbx
    jmp     .mps
.mpm: mov     byte [rbx], 0
    lea     rcx, [rel dirScratch]
    call    CreateDirectoryA
    mov     byte [rbx], '\'
    inc     rbx
    jmp     .mps
.mpd: add     rsp, 28h
    pop     rsi
    pop     rbx
    ret
load_file:
    push    rbx
    push    rsi
    sub     rsp, 50h
    mov     rbx, rcx
    mov     rcx, rbx
    mov     edx, GENERIC_READ
    mov     r8d, FILE_SHARE_READ
    xor     r9, r9
    mov     dword [rsp+20h], OPEN_EXISTING
    mov     dword [rsp+28h], FILE_ATTRIBUTE_NORMAL
    mov     qword [rsp+30h], 0
    call    CreateFileA
    cmp     rax, INVALID_HANDLE
    je      .lff
    mov     rsi, rax
    mov     rcx, rsi
    xor     edx, edx
    call    GetFileSize
    mov     [rel bufLen], eax
    mov     ebx, eax
    call    GetProcessHeap
    mov     rcx, rax
    mov     edx, 8
    lea     r8, [rbx+1]
    call    HeapAlloc
    test    rax, rax
    jz      .lfc
    mov     [rel buf], rax
    mov     rcx, rsi
    mov     rdx, rax
    mov     r8d, ebx
    lea     r9, [rel wrote]
    mov     qword [rsp+20h], 0
    call    ReadFile
    mov     rcx, rsi
    call    CloseHandle
    mov     rax, [rel buf]
    add     rsp, 50h
    pop     rsi
    pop     rbx
    ret
.lfc: mov     rcx, rsi
    call    CloseHandle
.lff: xor     eax, eax
    add     rsp, 50h
    pop     rsi
    pop     rbx
    ret
save_file:
    push    rbx
    push    rsi
    push    rdi
    sub     rsp, 50h
    mov     rbx, rcx
    mov     rsi, rdx
    mov     edi, r8d
    mov     rcx, rbx
    mov     edx, GENERIC_WRITE
    xor     r8, r8
    xor     r9, r9
    mov     dword [rsp+20h], CREATE_ALWAYS
    mov     dword [rsp+28h], FILE_ATTRIBUTE_NORMAL
    mov     qword [rsp+30h], 0
    call    CreateFileA
    cmp     rax, INVALID_HANDLE
    je      .sfd
    mov     rbx, rax
    mov     rcx, rbx
    mov     rdx, rsi
    mov     r8d, edi
    lea     r9, [rel wrote]
    mov     qword [rsp+20h], 0
    call    WriteFile
    mov     rcx, rbx
    call    CloseHandle
.sfd: add     rsp, 50h
    pop     rdi
    pop     rsi
    pop     rbx
    ret

section .data
msgBoot: db "sync-skills [x86-64 asm]: byte-copy SKILL.md (format-aware: npm run sync:skills)", 13, 10, 0
msgWrote: db "  wrote ", 0
msgNl: db 13, 10, 0
msgDone: db "Done.", 13, 10, 0
msgFail: db "Error: cannot read SKILL.md", 13, 10, 0
sep: db "\", 0
srcRel: db ".claude\skills\clone-website\SKILL.md", 0
destTable:
    db ".codex\skills\clone-website\SKILL.md", 0
    times 64-($-destTable) db 0
d1: db ".github\skills\clone-website\SKILL.md", 0
    times 64-($-d1) db 0
d2: db ".cursor\commands\clone-website.md", 0
    times 64-($-d2) db 0
d3: db ".windsurf\workflows\clone-website.md", 0
    times 64-($-d3) db 0
d4: db ".gemini\commands\clone-website.toml", 0
    times 64-($-d4) db 0
d5: db ".opencode\commands\clone-website.md", 0
    times 64-($-d5) db 0
d6: db ".augment\commands\clone-website.md", 0
    times 64-($-d6) db 0
d7: db ".continue\commands\clone-website.md", 0
    times 64-($-d7) db 0
d8: db ".amazonq\cli-agents\clone-website.json", 0
    times 64-($-d8) db 0

section .bss
alignb 8
hOut: resq 1
buf: resq 1
wrote: resd 1
bufLen: resd 1
modPath: resb 512
root: resb 512
srcPath: resb 768
dstPath: resb 768
dirScratch: resb 768
