import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Update } from '../libs/update';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { Item } from './item';
import { Util } from '../libs/util';
import { MousePointer } from '../core/mousePointer';


export class Visual extends Canvas {

  private _con:Object3D;


  constructor(opt: any) {
    super(opt);

    this._con = new Object3D();
    this.mainScene.add(this._con);

    const num = 20;
    const geo = new SphereGeometry(0.5, 64, 64);
    for(let i = 0; i < num; i++) {
      const item = new Item({
        geo: geo,
        id: i,
        total: num,
        scale: Util.instance.map(Math.abs(i - num * 0.5), 0.01, 2, 0, num * 0.5),
      });
      this._con.add(item);
    }

    // this._con.rotation.x = Util.instance.radian(45);
    // this._con.rotation.y = Util.instance.radian(45);
    // this._con.rotation.z = Util.instance.radian(45);

    this._resize();
  }


  protected _update(): void {
    super._update();

    this._con.position.y = Func.instance.screenOffsetY() * -1;

    const mx = MousePointer.instance.easeNormal.x;
    const my = MousePointer.instance.easeNormal.y;

    this._con.rotation.x = Util.instance.radian(my * 90);
    this._con.rotation.y = Util.instance.radian(mx * 90);

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.render(this.mainScene, this.cameraPers);
  }


  public isNowRenderFrame(): boolean {
    return this.isRender && Update.instance.cnt % 1 == 0
  }


  _resize(): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    this.renderSize.width = w;
    this.renderSize.height = h;

    this._updateOrthCamera(this.cameraOrth, w, h);

    this.cameraPers.fov = 90;
    this._updatePersCamera(this.cameraPers, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();
  }
}
