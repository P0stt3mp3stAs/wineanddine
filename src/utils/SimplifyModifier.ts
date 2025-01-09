import { BufferGeometry } from 'three';

declare module 'three' {
  class SimplifyModifier {
    modify(geometry: BufferGeometry, count: number): BufferGeometry;
  }
}