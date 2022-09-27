const { from, fromEvent, throwError, of, combineLatest, merge } = rxjs;
const { filter, map, tap, startWith, flatMap,
  catchError, pairwise, mapTo, takeUntil } = rxjs.operators;

const URL = "";

/* lógica principal */
const buildBussinessLogicStream = (expInput, valInput) => {
  //fromEvent(expInput, "change")
}

const buildEnterExitStreams = (cell, expInput, valInput) => {
  merge(
    fromEvent(cell, "click").pipe(mapTo(1)),
    fromEvent(expInput, "blur").pipe(mapTo(2))
  ).subscribe(evt => {
    if (evt === 1) {
      [valInput.hidden, expInput.hidden] = [true, false];
      expInput.focus();
    } else {
      [valInput.hidden, expInput.hidden] = [false, true];
    }
  });

  fromEvent(expInput, "keydown")
    .pipe(
      filter(evt => evt.key == "Enter" || evt.keyCode === 13),
      map(evt => evt.target.value),
      startWith(""), //todas as células começam com string vazias
      pairwise(),
      map(([prevVal, currVal]) => prevVal != currVal))
    .subscribe(isDifferent => {
      if (isDifferent) { //apenas emite se de fato houve mudança
        expInput.dispatchEvent(new Event("change"));
      }
      expInput.blur()
    });
}