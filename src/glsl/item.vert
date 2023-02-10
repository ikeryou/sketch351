uniform float radius;
uniform float center;

varying vec3 vPos;

void main(){
  vPos = position;
  // float t = (position.y * position.x) * 1.75 + time * 0.025;
  // // float t2 = (position.y * position.x) * 0.35 + time * -0.032;
  // p.z += (sin(t) * cos(t * -0.45)) * radius;
  // vVisible = step(distance(position.y, center), radius);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
