import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { SceneProvider, useScene } from "./SceneContext";
import type { ReactNode } from "react";

const wrapper = ({ children }: { children: ReactNode }) => <SceneProvider>{children}</SceneProvider>;

describe("SceneContext", () => {
  it("starts in the corridor with no active room", () => {
    const { result } = renderHook(() => useScene(), { wrapper });
    expect(result.current.activeRoom).toBeNull();
    expect(result.current.isInRoom).toBe(false);
  });

  it("enters a room by id", () => {
    const { result } = renderHook(() => useScene(), { wrapper });
    act(() => result.current.enterRoom("gallery"));
    expect(result.current.activeRoom).toBe("gallery");
    expect(result.current.isInRoom).toBe(true);
  });

  it("exits back to the corridor", () => {
    const { result } = renderHook(() => useScene(), { wrapper });
    act(() => result.current.enterRoom("studio"));
    act(() => result.current.exitRoom());
    expect(result.current.activeRoom).toBeNull();
    expect(result.current.isInRoom).toBe(false);
  });
});
