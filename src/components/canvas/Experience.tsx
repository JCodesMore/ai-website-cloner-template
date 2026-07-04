"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Corridor } from "./Corridor";
import { GalleryRoom } from "./rooms/GalleryRoom";
import { StudioRoom } from "./rooms/StudioRoom";
import { AboutRoom } from "./rooms/AboutRoom";
import { ContactRoom } from "./rooms/ContactRoom";
import { useScene, type RoomId } from "@/context/SceneContext";
import { useRoomCamera } from "@/hooks/useRoomCamera";

const DOOR_LABELS = ["Gallery", "Studio", "About", "Contact"];
const ROOM_BY_INDEX: RoomId[] = ["gallery", "studio", "about", "contact"];

const ROOM_COMPONENTS: Record<RoomId, () => React.ReactElement> = {
  gallery: GalleryRoom,
  studio: StudioRoom,
  about: AboutRoom,
  contact: ContactRoom,
};

// Invisible but still raycast-hittable (visible={false} doesn't affect
// Three.js/R3F pointer events) — temporary exit trigger until a proper
// HUD "back to corridor" affordance replaces it.
const EXIT_TRIGGER_POSITION: [number, number, number] = [0, -3, 0];

interface SceneContentProps {
  activeRoom: RoomId | null;
  enterRoom: (room: RoomId) => void;
  exitRoom: () => void;
}

// Lives inside <Canvas> so it can call useThree() via useRoomCamera to
// reposition the persistent camera whenever the active room changes.
function SceneContent({ activeRoom, enterRoom, exitRoom }: SceneContentProps) {
  const RoomComponent = activeRoom ? ROOM_COMPONENTS[activeRoom] : null;

  useRoomCamera(activeRoom !== null);

  return (
    <>
      <Suspense fallback={null}>
        {RoomComponent ? (
          <RoomComponent />
        ) : (
          <Corridor doorLabels={DOOR_LABELS} onDoorSelect={(index) => enterRoom(ROOM_BY_INDEX[index])} />
        )}
      </Suspense>
      {activeRoom !== null && (
        <mesh position={EXIT_TRIGGER_POSITION} onClick={exitRoom} visible={false}>
          <boxGeometry args={[0.01, 0.01, 0.01]} />
        </mesh>
      )}
    </>
  );
}

export function Experience() {
  const { activeRoom, enterRoom, exitRoom } = useScene();

  return (
    <Canvas camera={{ position: [0, 0, -2], rotation: [0, Math.PI, 0], fov: 60 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 4, 2]} intensity={0.6} />
      <SceneContent activeRoom={activeRoom} enterRoom={enterRoom} exitRoom={exitRoom} />
    </Canvas>
  );
}
