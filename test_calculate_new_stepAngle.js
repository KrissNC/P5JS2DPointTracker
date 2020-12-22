let startAngle = degToRad(-10);
let endAngle = degToRad(80); // change to 27 then 28 to test

let deltaPerStepDeg = 10; // degrees by step : degrees per frame : angular speed
let deltaPerStepRad = degToRad(deltaPerStepDeg);

let angleDistance = endAngle - startAngle;

let idealNrOfSteps;

let v1 = angleDistance / deltaPerStepRad; // approximate number of steps
let v2 = Math.floor(approxNrSteps); // number of full steps
let decimalPart = approxNrSteps - roundedNrOfSteps;
if (decimalPart >= 0.5) idealNrOfSteps = roundedNrOfSteps + 1;
// increasing the number of step => diminish the step size
else idealNrOfSteps = roundedNrOfSteps; // number of steps is correct => slightly incease the step size

let stepSize = angleDistance / idealNrOfSteps; // adjusted Step size

let stepcount = Math.round(angleDistance / stepSize);

console.log("exact number of length " + deltaPerStepDeg + " segments : " + approxNrSteps);
console.log("ideal number of steps : " + idealNrOfSteps);

console.log(
  "exact number of length " + radToDeg(stepSize) + " segments : " + stepCount
);

/*
let nStep = 0;

while (currentAngle != endAngle) {
  if (distanceToCover < deltaPerStepRad) {
    console.log("final step");
    currentAngle = endAngle;
  } else {
    currentAngle += direction * deltaPerStepRad;
  }

  nStep++;
  console.log("Pas " + nStep);
  console.log(Math.round(radToDeg(currentAngle)));

  distanceToCover = Math.abs(endAngle - currentAngle);
}
*/
/*


















*/
function radToDeg(rad) {
  // 2PI*rad = 360 deg; PI.rad = 180 deg => 1 rad = 180/PI deg
  // 30 rad = 30 * 180/PI deg
  return (180 / Math.PI) * rad;
}

function degToRad(deg) {
  // 2PI * 1rad = 360 deg; PI.rad = 180 deg => 1 deg = PI/180 rad
  // > 360 deg = 360 (PI /180) * 1rad => 360deg = 2PI *1rad
  return (Math.PI / 180) * deg;
}
