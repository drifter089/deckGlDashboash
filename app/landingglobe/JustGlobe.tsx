"use client";

import React, { forwardRef } from "react";
import R3fGlobe, { GlobeMethods, GlobeProps } from "r3f-globe";

const GlobeOnly = forwardRef<GlobeMethods, GlobeProps>((props, ref) => (
  <R3fGlobe {...props} ref={ref as React.MutableRefObject<GlobeMethods | undefined>} />
));

GlobeOnly.displayName = "GlobeOnly";

export default GlobeOnly;
