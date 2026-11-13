import "leaflet";

declare module "leaflet" {
  interface PatternOptions {
    offset?: string | number;
    endOffset?: string | number;
    repeat?: string | number;
    symbol: unknown;
  }
  function polylineDecorator(line: Polyline, options: { patterns: PatternOptions[] }): Layer;
  namespace Symbol {
    function arrowHead(options: { pixelSize?: number; polygon?: boolean; pathOptions?: PathOptions }): unknown;
  }
}
