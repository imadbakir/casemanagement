import { Animation } from '@ionic/core';

export function slideIn(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    // tslint:disable-next-line:no-non-null-assertion
    const wrapperElRect = wrapperEl!.getBoundingClientRect();
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateX', `${window.innerWidth - wrapperElRect.left}px`, '0%');

    backdropAnimation.fromTo('opacity', 0.01, 0.4);

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));

}

export function slideInRtl(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {

    const baseAnimation = new AnimationC();

    const backdropAnimation = new AnimationC();
    backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    const wrapperAnimation = new AnimationC();
    const wrapperEl = baseEl.querySelector('.modal-wrapper');
    wrapperAnimation.addElement(wrapperEl);
    // tslint:disable-next-line:no-non-null-assertion
    const wrapperElRect = wrapperEl!.getBoundingClientRect();
    wrapperAnimation.beforeStyles({ 'opacity': 1 })
        .fromTo('translateX', `${- wrapperElRect.right}px`, '0%');

    backdropAnimation.fromTo('opacity', 0.01, 0.4);

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.36,0.66,0.04,1)')
        .duration(400)
        .beforeAddClass('show-modal')
        .add(backdropAnimation)
        .add(wrapperAnimation));

}

