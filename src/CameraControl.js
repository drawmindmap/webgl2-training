import {
  getClientPoint,
} from './Util';

export default class CameraControl {
  constructor() {
    this.panSpeed = 0.1;
    this.zoomSpeed = 1.1;
    this.rotateSpeed = Math.PI / 180;
  }

  attach(canvas) {
    if (this._canvas) {
      return;
    }
    this._canvas = canvas;

    let lastPoint;
    let isPanning;

    this._handleMouseMove = (e) => {
      const point = getClientPoint(e);
      const offsetX = point.x - lastPoint.x;
      const offsetY = point.y - lastPoint.y;
      if (offsetX !== 0 || offsetY !== 0) {
        if (isPanning) {
          this.onPan(offsetX * this.panSpeed, offsetY * this.panSpeed);
        } else {
          this.onRotate(offsetX * this.rotateSpeed, offsetY * this.rotateSpeed);
        }
      }
      lastPoint = point;
    };

    this._clean = () => {
      lastPoint = null;
      window.removeEventListener('mousemove', this._handleMouseMove);
      window.removeEventListener('mouseup', this._clean);
      window.removeEventListener('touchmove', this._handleMouseMove);
      window.removeEventListener('touchend', this._clean);
    };

    this._handleMouseDown = (e) => {
      e.preventDefault();
      if (e.button !== 0 && e.button !== 2) {
        return;
      }
      isPanning = e.button === 2;
      this._canvas.focus();
      lastPoint = getClientPoint(e);
      window.addEventListener('mousemove', this._handleMouseMove);
      window.addEventListener('mouseup', this._clean);
      window.addEventListener('touchmove', this._handleMouseMove);
      window.addEventListener('touchend', this._clean);
    };

    this._handleWheel = (e) => {
      if (e.deltaY !== 0) {
        this.onZoom(e.deltaY > 0 ? this.zoomSpeed : 1 / this.zoomSpeed);
      }
    };

    this._handleContextmenu = (e) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', this._handleMouseDown);
    canvas.addEventListener('touchstart', this._handleMouseDown, { passive: false });
    canvas.addEventListener('wheel', this._handleWheel, { passive: false });
    canvas.addEventListener('blur', this._clean);
    canvas.addEventListener('contextmenu', this._handleContextmenu);
  }

  detach() {
    if (!this._canvas) {
      return;
    }
    this._canvas.removeEventListener('mousedown', this._handleMouseDown);
    this._canvas.removeEventListener('touchstart', this._handleMouseDown);
    this._canvas.removeEventListener('wheel', this._handleWheel);
    this._canvas.removeEventListener('blur', this._clean);
    this._canvas.removeEventListener('contextmenu', this._handleContextmenu);
  }
}
