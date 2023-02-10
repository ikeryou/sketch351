uniform vec3 color;
uniform float alpha;
uniform float radius;
uniform float center;

varying vec3 vPos;

void main(void) {
  vec4 dest = vec4(color, 1.0);
  dest.a *= step(distance(vPos.y, center), radius);
  gl_FragColor = dest;
}
