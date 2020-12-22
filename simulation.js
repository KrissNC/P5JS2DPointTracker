let DOUBLEPI;
let currentAngle;
let stepCount;
let stepSize;
let direction;
let nStep;

let startAngle;
let endAngle;

function setup() {
  createCanvas(600, 400);

  DOUBLEPI = Math.PI * 2;

  startAngle = degToRad(0);
  endAngle = degToRad(270);
  let deltaPerStepDeg = 10; // degrees by step : degrees per frame : angular speed

  calculate_steps(startAngle, endAngle, deltaPerStepDeg);

  nStep = 0;

  currentAngle = startAngle;
}

function draw() {
  background(220);

  line(
    100,
    100,
    100 + 100 * Math.cos(currentAngle),
    100 + 100 * Math.sin(currentAngle)
  );

  if (nStep < stepCount) {
    // one step

    console.log(radToDeg(currentAngle));
    oneStep();
  }
}

function oneStep() {
  nStep++;
  if (nStep < stepCount) {
    currentAngle += direction * stepSize;
  } else {
    //console.log("final step");
    currentAngle = endAngle;
  }

  //console.log("Pas " + nStep + " : Angle=" + radToDeg(currentAngle));
}

function calculate_steps(startAngle, endAngle, deltaPerStepDeg) {
  // this function calculates direction, step length, and (integer) number of steps to reach endAngle from startAngle
  // angles are in radians

  let v1 = createVector(Math.cos(startAngle), Math.sin(startAngle));
  let v2 = createVector(Math.cos(endAngle), Math.sin(endAngle));
  // console.log( "Simulating from " + Math.round(radToDeg(startAngle)) + " to " + Math.round(radToDeg(endAngle)) );

  let deltaPerStepRad = degToRad(deltaPerStepDeg);

  let angleDistance = getDirectedAngle(v1, v2);

  direction = angleDistance > 0 ? 1 : -1; // keep track of direction
  // deleteconsole.log(radToDeg(angleDistance));

  angleDistance = Math.abs(angleDistance);

  let idealNrOfSteps;

  let approxNrSteps = angleDistance / deltaPerStepRad; // approximate number of steps
  let roundedNrOfSteps = Math.floor(approxNrSteps); // number of full steps
  let decimalPart = approxNrSteps - roundedNrOfSteps;
  if (decimalPart >= 0.5) idealNrOfSteps = roundedNrOfSteps + 1;
  // increasing the number of steps => will diminish the step size
  else idealNrOfSteps = roundedNrOfSteps; // number of steps is correct => slightly incease the step size

  stepSize = angleDistance / idealNrOfSteps; // adjusted Step size

  stepCount = Math.round(angleDistance / stepSize);

  // result is : direction, stepSize, and stepCount
}

function getDirectedAngle(v1, v2) {
  // retrun oriented (+-) angle between 2 vectors from v1 to v2

  let angleV1 = Math.atan2(v1.y, v1.x);
  let angleV2 = Math.atan2(v2.y, v2.x);

  let diffAngle = angleV2 - angleV1;

  if (angleV1 <= 0) {
    // -PI to 0, upper half
    if (diffAngle >= PI) diffAngle -= DOUBLEPI;
  } else {
    // 0+ to PI
    if (diffAngle <= -PI) diffAngle += DOUBLEPI;
  }

  return diffAngle;
}

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
