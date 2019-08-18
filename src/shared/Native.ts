import { Canvas, Image } from 'canvas';
import { NativeFactory } from 'ginkgoch-map';

NativeFactory.register({
    createCanvas: (w, h) => new Canvas(w, h),
    createNativeImage: () => new Image()
});