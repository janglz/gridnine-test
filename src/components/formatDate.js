// const days =["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
// const months = []




export default (date) => {
   date.toLocaleString('ru', { ddady: 'numeric', month: 'short', weekday: 'short' });
}