const selectedEvents = nodesFromSelection()
    .filter((n) => isEventNode(n))
    .map((n) => n.value);
  
const eventIntervals = [];
let min
let max

const { DateTime, Interval } = luxon
selectedEvents.forEach((event) => {
  const from = DateTime.fromISO(event.dateRangeIso.fromDateTimeIso);
  const to = DateTime.fromISO(event.dateRangeIso.toDateTimeIso);
  min = !min ? from : +from < +min ? from : min;
  max = !max ? to : +to > +max ? to : max
  eventIntervals.push({
    stringIndex: {
      from: event.rangeInText.from,
      to: event.rangeInText.to,
    },
    interval: Interval.fromDateTimes(from, to)
  })
});

const totalInterval = Interval.fromDateTimes(min, max)
const intervals = Interval.merge(eventIntervals.map(i => i.interval));
const freeIntervals = totalInterval.difference(...intervals)

const stringToInsert = freeIntervals.map(i => {
  return `${dateRangeFromInterval(i)}: Free time #available`
}).join('\n')

if (stringToInsert) {
  return {
    changes: [{
      insert: `${stringToInsert}\n`,
      from: eventIntervals[0].stringIndex.from
    }]
  }
}

function dateRangeFromInterval(interval) {
  return `${interval.start.toISODate()}/${interval.end.toISODate()}`
}