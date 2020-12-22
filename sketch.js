// target
var targetEndSegX;
var targetEndSegY;
var targetSegmentLength;

var targetAngle;

var virtualCenterX;
var virtualCenterY;

var DOUBLEPI;

var nbGuns = 8;
var gunArray = new Array(nbGuns);
var sensitivity = 0.03;
var i;

function Gun(x, y, l, a, speed) {
  this.draw = function () {
    line(this.OrigX, this.OrigY, this.EndX, this.EndY);
    ellipse(this.OrigX, this.OrigY, 4, 4);
  };

  this.update = function () {
    if (this.nStep < this.stepCount) {
      // one step
      //      console.log("angle is : " + radToDeg(this.Angle));
      this.oneStep();
      //      console.log("new angle is : " + radToDeg(this.Angle));
    }
  };

  this.oneStep = function () {
    this.nStep++;

    //    console.log("Before stepping Angle=" + radToDeg(this.Angle));

    if (this.nStep < this.stepCount) {
      this.Angle += this.direction * this.stepSize;
    } else {
      //console.log("final step");
      this.Angle = this.targetAngle;
      //console.log(radToDeg(this.Angle));
      //this.targetAngle = 0;
      this.stepSize = 0;
      this.stepCount = 0;
      this.nStep = 0;
    }

    // update segment coordinates due to new angle
    this.EndX = this.OrigX + this.Length * cos(this.Angle);
    this.EndY = this.OrigY + this.Length * sin(this.Angle);
    this.Vect = createVector(cos(this.Angle), sin(this.Angle));
    /*
    console.log(
      "After step " + this.nStep + " : Angle=" + radToDeg(this.Angle)
    );
*/
  };

  this.calculate_steps = function (startAngle, targetAngle, deltaPerStepDeg) {
    // this function calculates direction, step length, and (integer) number of steps to reach endAngle from startAngle
    // angles are in radians

    let v1 = createVector(Math.cos(startAngle), Math.sin(startAngle));
    let v2 = createVector(Math.cos(targetAngle), Math.sin(targetAngle));
    // console.log( "Simulating from " + Math.round(radToDeg(startAngle)) + " to " + Math.round(radToDeg(endAngle)) );

    let deltaPerStepRad = degToRad(deltaPerStepDeg);

    let angleDistance = getDirectedAngle(v1, v2);

    this.direction = angleDistance > 0 ? 1 : -1; // keep track of direction
    // deleteconsole.log(radToDeg(angleDistance));

    angleDistance = Math.abs(angleDistance);

    let idealNrOfSteps;

    let approxNrSteps = angleDistance / deltaPerStepRad; // approximate number of steps
    let roundedNrOfSteps = Math.floor(approxNrSteps); // number of full steps
    let decimalPart = approxNrSteps - roundedNrOfSteps;
    if (decimalPart >= 0.5) idealNrOfSteps = roundedNrOfSteps + 1;
    // increasing the number of steps => will diminish the step size
    else idealNrOfSteps = roundedNrOfSteps; // number of steps is correct => slightly incease the step size

    this.stepSize = angleDistance / idealNrOfSteps; // adjusted Step size

    this.stepCount = Math.round(angleDistance / this.stepSize);

    // result is : direction, stepSize, and stepCount
  };

  this.setNewTarget = function (targetEndSegX, targetEndSegY) {
    let deltaX = targetEndSegX - this.OrigX;
    let deltaY = targetEndSegY - this.OrigY;

    let v2 = createVector(deltaX, deltaY);

    let oneDegree = degToRad(1);

    //let angleV2 = Math.atan2(v2.y, v2.x);

    let deltaAngle = getDirectedAngle(this.Vect, v2);

    //console.log("trying to move " + radToDeg(deltaAngle));

    // if less than on degree we don't recalculate
    if (Math.abs(deltaAngle) >= oneDegree) {
      this.targetAngle = v2.heading();
      this.calculate_steps(this.Angle, this.targetAngle, this.rotatingSpeed);
      //console.log("new target !");
      //console.log(this);
    }
  };

  // construction
  this.OrigX = x;
  this.OrigY = y;
  this.Length = l;
  this.Angle = a;

  this.Vect = createVector(cos(this.Angle), sin(this.Angle));

  this.rotatingSpeed = speed;

  this.stepSize = 0;
  this.targetAngle = 0;

  this.EndX = this.OrigX + this.Length * cos(this.Angle);
  this.EndY = this.OrigY + this.Length * sin(this.Angle);

  // when moving around origin
  this.stepSize = 0;
  this.stepCount = 0;
  this.direction = 0;
  this.nStep = 0;
}

function setup() {
  createCanvas(600, 400);

  virtualCenterX = width / 2;
  virtualCenterY = height / 2;

  DOUBLEPI = 2 * Math.PI;

  i = 0;
  for (i = 0; i < nbGuns; i++) {
    // let's start a segment inside a 300width 120height rectangle
    var P1x = virtualCenterX + floor(random(300) - 150);
    var P1y = virtualCenterY + floor(random(120) - 60);
    var P1SegmentLength = 40 + floor(random(20) - 10);
    var vect1Angle = degToRad(floor(random(360)));
    var movingSpeedDeg = 5;

    gunArray[i] = new Gun(
      P1x,
      P1y,
      P1SegmentLength,
      vect1Angle,
      movingSpeedDeg
    );
  }

  // console.log(gunArray);
}

function draw() {
  background(220);

  for (i = 0; i < nbGuns; i++) gunArray[i].update();

  strokeWeight(1);
  stroke("red");
  rect(virtualCenterX - 150, virtualCenterY - 60, 300, 120);

  strokeWeight(1);
  stroke("green");

  for (i = 0; i < nbGuns; i++) gunArray[i].draw();

  /*
  if (targetEndSegX > 0) {
    stroke("blue");
    strokeWeight(1);
    for (i = 0; i < nbGuns; i++) {
      // ellipse(targetEndSegX, targetEndSegY, 1, 1);
      line(gunArray[i].OrigX, gunArray[i].OrigY, targetEndSegX, targetEndSegY);
    }
  }
  */
}

function mousePressed() {
  targetEndSegX = mouseX;
  targetEndSegY = mouseY;

  for (i = 0; i < nbGuns; i++)
    gunArray[i].setNewTarget(targetEndSegX, targetEndSegY);
}

function getDirectedAngle(v1, v2) {
  //let angleV1 = (Math.atan2(v1.y, v1.x)+ DOUBLEPI) %PI;
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

  // console.log("getDirectedAngle returning" + radToDeg(diffAngle) + " degrees");
  return diffAngle;
}

// linear lerp
function lerp(v0, v1, t) {
  return (1 - t) * v0 + t * v1;
}

function approx(v) {
  // return 2 decimal casted number
  let dec2 = Math.floor(v * 100) / 100;
  return dec2;
}

function radToDeg(rad) {
  // 2PI*rad = 360 deg; PI.rad = 180 deg => 1 rad = 180/PI deg
  // 30 rad = 30 * 180/PI deg
  return (180 / Math.PI) * rad;
}

function degToRad(rad) {
  // 2PI * 1rad = 360 deg; PI.rad = 180 deg => 1 deg = PI/180 rad
  // > 360 deg = 360 (PI /180) * 1rad => 360deg = 2PI *1rad
  return (Math.PI / 180) * rad;
}
