; sync-agent-rules.asm — Windows x86-64
; Copies AGENTS.md to agent config destinations that do not read it natively.
; Build via: npm run build:asm

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
GENERIC_READ      equ 80000000h
GENERIC_WRITE     equ 40000000h
FILE_SHARE_READ   equ 1
OPEN_EXISTING     equ 3
CREATE_ALWAYS     equ 2
FILE_ATTRIBUTE_NORMAL equ 80h
INVALID_HANDLE    equ -1

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
    call    strip_leaf              ; bin\sync-agent-rules.exe -> repo root

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

    ; Compose payload = header + source
    lea     rcx, [rel header]
    call    lstrlenA
    mov     [rel hdrLen], eax
    mov     edx, eax
    add     edx, [rel bufLen]
    mov     [rel outLen], edx

    call    GetProcessHeap
    mov     rcx, rax
    mov     edx, 8
    mov     r8d, [rel outLen]
    inc     r8d
    call    HeapAlloc
    test    rax, rax
    jz      .fail
    mov     [rel outBuf], rax

    mov     rdi, rax
    lea     rsi, [rel header]
    mov     ecx, [rel hdrLen]
    rep movsb
    mov     rsi, [rel buf]
    mov     ecx, [rel bufLen]
    rep movsb
    mov     byte [rdi], 0

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
    mov     rdx, [rel outBuf]
    mov     r8d, [rel outLen]
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
    mov     r8, [rel outBuf]
    call    HeapFree
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
.zc:
    lodsb
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
.find:
    cmp     byte [rdi], 0
    je      .cat
    inc     rdi
    jmp     .find
.cat:
    lodsb
    stosb
    test    al, al
    jnz     .cat
    pop     rdi
    pop     rsi
    ret

strip_leaf:
    push    rbx
    mov     rbx, rcx
    call    lstrlenA
    mov     ecx, eax
    test    ecx, ecx
    jz      .sl_done
    dec     ecx
.sl_scan:
    cmp     ecx, 0
    jl      .sl_done
    mov     al, [rbx+rcx]
    cmp     al, '\'
    je      .sl_cut
    cmp     al, '/'
    je      .sl_cut
    dec     ecx
    jmp     .sl_scan
.sl_cut:
    mov     byte [rbx+rcx], 0
.sl_done:
    pop     rbx
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
    jne     .mp_scan
    add     rbx, 3
.mp_scan:
    mov     al, [rbx]
    test    al, al
    jz      .mp_done
    cmp     al, '\'
    je      .mp_mk
    cmp     al, '/'
    je      .mp_mk
    inc     rbx
    jmp     .mp_scan
.mp_mk:
    mov     byte [rbx], 0
    lea     rcx, [rel dirScratch]
    call    CreateDirectoryA
    mov     byte [rbx], '\'
    inc     rbx
    jmp     .mp_scan
.mp_done:
    add     rsp, 28h
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
    je      .lf_fail
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
    jz      .lf_close_fail
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
.lf_close_fail:
    mov     rcx, rsi
    call    CloseHandle
.lf_fail:
    xor     eax, eax
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
    je      .sf_done
    mov     rbx, rax
    mov     rcx, rbx
    mov     rdx, rsi
    mov     r8d, edi
    lea     r9, [rel wrote]
    mov     qword [rsp+20h], 0
    call    WriteFile
    mov     rcx, rbx
    call    CloseHandle
.sf_done:
    add     rsp, 50h
    pop     rdi
    pop     rsi
    pop     rbx
    ret

section .data

DEST_COUNT  equ 4
DEST_STRIDE equ 64

msgBoot:  db "sync-agent-rules [x86-64 asm]: propagating AGENTS.md", 13, 10, 0
msgWrote: db "  wrote ", 0
msgNl:    db 13, 10, 0
msgDone:  db "Done.", 13, 10, 0
msgFail:  db "Error: cannot read AGENTS.md.", 13, 10, 0
sep:      db "\", 0
srcRel:   db "AGENTS.md", 0

header:
    db "<!-- AUTO-GENERATED from AGENTS.md — do not edit directly.", 13, 10
    db "     Run `npm run sync:rules` to regenerate. -->", 13, 10, 13, 10, 0

destTable:
    db ".github\copilot-instructions.md", 0
    times 64-($-destTable) db 0
a1:
    db ".clinerules", 0
    times 64-($-a1) db 0
a2:
    db ".continue\rules\project.md", 0
    times 64-($-a2) db 0
a3:
    db ".amazonq\rules\project.md", 0
    times 64-($-a3) db 0

section .bss
alignb 8
hOut:       resq 1
buf:        resq 1
outBuf:     resq 1
wrote:      resd 1
bufLen:     resd 1
hdrLen:     resd 1
outLen:     resd 1
modPath:    resb 512
root:       resb 512
srcPath:    resb 768
dstPath:    resb 768
dirScratch: resb 768
