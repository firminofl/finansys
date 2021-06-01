// Prototype
/*
function Microfone(color = 'black', isOn = false) {
  this.color = color;
  this.isOn = isOn;
}

Microfone.prototype.toggleOnOff = function () {
  if (this.isOn)
    console.log('Desligando...');
  else
    console.log('Ligando...');

  this.isOn = !this.isOn;
}

const microfone = new Microfone();
microfone.toggleOnOff();
microfone.toggleOnOff();

const microfone2 = new Microfone('white');
console.log(microfone2);
*/

// Class
/*
class Microfone {
  constructor(color = 'black', isOn = false) {
    this.color = color;
    this.isOn = isOn;
  }

  toggleOnOff() {
    if (this.isOn)
      console.log('Desligando...');
    else
      console.log('Ligando...');

    this.isOn = !this.isOn;
  }
}

const microfone = new Microfone();
console.log(microfone);
microfone.toggleOnOff();
 */
