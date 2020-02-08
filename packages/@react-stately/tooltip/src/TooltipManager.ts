export class TooltipManager {

  visibleTooltips?: null | {triggerId: string, state: {open: boolean, setOpen(value: boolean), tooltipManager: string}}
  hoverHideTimeout?: null | ReturnType<typeof setTimeout>;
  hoverShowTimeout?: null | ReturnType<typeof setTimeout>;

  // Arbitrary timeout lengths in place for current demo purposes. Delays to be adjusted for warmup / cooldown logic PR
    // https://git.corp.adobe.com/Spectrum/spectrum-dna/blob/master/data/elements/tooltip/TooltipBase.mjs
    // https://git.corp.adobe.com/Spectrum/spectrum-dna/blob/aab3963cebeb16df0081a805a1394fbc2d46a851/data/globals/GlobalAnimation.mjs
  constructor() {
    this.visibleTooltips = null;
    this.hoverHideTimeout = null;
    this.hoverShowTimeout = null;
  }

  updateTooltipState(state, triggerId)  {
    state.setOpen(!state.open);
    this.visibleTooltips = {triggerId, state};
  }

  isSameTarget(currentTriggerId) {
    return currentTriggerId === this.visibleTooltips.triggerId;
  }

  showTooltip(state) {
    state.setOpen(true);
    // Close previously open tooltip
    if (this.visibleTooltips) {
      this.visibleTooltips.state.setOpen(false);
    }
  }

  hideTooltip(state) {
    state.setOpen(false);
    this.visibleTooltips = null;
  }

  showTooltipDelayed(state, triggerId) {
    if (this.hoverHideTimeout && this.isSameTarget(triggerId)) {
      clearTimeout(this.hoverHideTimeout);
      this.hoverHideTimeout = null;
      return;
    }

    this.hoverShowTimeout = setTimeout(() => {
      this.hoverShowTimeout = null;
      this.showTooltip(state);
      this.visibleTooltips = {triggerId, state};
    }, 200);
  }

  hideTooltipDelayed(state) {
    if (this.hoverShowTimeout) {
      clearTimeout(this.hoverShowTimeout);
      this.hoverShowTimeout = null;
      return;
    }

    this.hoverHideTimeout = setTimeout(() => {
      this.hoverHideTimeout = null;
      this.hideTooltip(state);
    }, 200);
  }
}
