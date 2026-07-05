FieldOps Atlas — 3D Graphics

Files
-----
mountain-a-full.js
  Mountain A, full/lossless geometry.

mountain-a-compressed.js
  Mountain A, indexed, quarter-mirrored and 16-bit quantised.

mountain-b-full.js
  Mountain B, full/lossless geometry with the earlier gentle termination.

mountain-b-compressed.js
  Mountain B, compressed from a different quadrant so it differs from A.

mountain-renderer.js
  Selects A or B and compressed or full.

Text copies
-----------
Each JavaScript file has an exact .txt copy for opening and copying on mobile.

Usage
-----
Default: Mountain A compressed

<div data-rf-graph></div>
<script src="./3D Graphics/mountain-renderer.js" defer></script>

Mountain B compressed

<div
  data-rf-graph
  data-mountain="B"
  data-mountain-quality="compressed"
></div>
<script src="./3D Graphics/mountain-renderer.js" defer></script>

Use data-mountain="A" or "B".
The renderer also accepts "1" for A and "2" for B.
Use data-mountain-quality="compressed" or "full".
