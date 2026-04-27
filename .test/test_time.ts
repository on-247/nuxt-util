import { run_test } from "./util";
import { assert } from "./util";
import { adjust,} from "../src/lib/time";
import { set } from "../src/lib/time";
import { Day } from "../src/lib/time";
import { Week } from "../src/lib/time";
import { Month } from "../src/lib/time";
import { Quarter } from "../src/lib/time";

const DAY_TS = 1769382000; // midnight
const DAY_RTS = 1769426526;
const DAY_NAME = "ma";
const WEEK_MIN = 1730674800;
const WEEK_MAX = 1731193200;
const MONTH_MIN = 1759269600;
const MONTH_MAX = 1761865200;
const MID_OCT = new Date();
MID_OCT.setMonth(9);
MID_OCT.setDate(16);
MID_OCT.setFullYear(2025);

function test_day() {
	let d = Day.from_ts(DAY_RTS);
	assert.describe('Day name').equal(d.name, DAY_NAME);
	assert.describe('Should not be today').equal(d.is_today, false);
	assert.describe('Day TS at midnight').equal(d.ts, DAY_TS);
	assert.describe('min == ts').equal(d.min, d.ts);
	assert.describe('Day TS before midnight').equal(d.max, DAY_TS + Day.HOURS - 1);
}

function test_day_is_today() {
	let d = new Day();
	assert.describe('Is today').equal(d.is_today, true);
}

function test_day_matches() {
	let d = Day.from_ts(DAY_RTS);
  assert.describe('Date object').equal(d.matches(new Date(DAY_RTS * 1000)), true);
  assert.describe('Real TS').equal(d.matches(DAY_RTS), true);
  assert.describe('Day TS').equal(d.matches(DAY_TS), true);
  assert.describe('Day TS prev day').equal(d.matches(DAY_TS - Day.HOURS), false);
  assert.describe('Day TS next day').equal(d.matches(DAY_TS + Day.HOURS), false);
}

function test_day_next_and_prev() {
	var d = Day.from_ts(DAY_RTS);
  var p = d.prev();
  var n = d.next();
  assert.describe(1).equal(p.min, DAY_TS - Day.HOURS);
  assert.describe(2).equal(n.min, DAY_TS + Day.HOURS);
}

function test_week_min_max() {
	/**
	 * Test min and max of a week
	 * containing 8 nov 2024
	 */
  let date = set(new Date, { y: 2024, mth: 10, d: 5, });
	let week = new Week(date);
	assert.describe(1).equal(week.min.ts, WEEK_MIN);
	assert.describe(2).equal(week.max.ts, WEEK_MAX);
}

function test_week_num() {
	/**
	 * Test week number of week
	 * containing 6 oct 2026
	 */
  let date = set(new Date, { y: 2026, mth: 9, d: 4 });
	let week = new Week(date);
	assert.equal(week.number, 40);
  set(date, { d: 5 });
	let week2 = new Week(date);
	assert.equal(week2.number, 41);
}

function test_week_next_and_prev() {
	/**
	 * Test next and previous week
	 */
  let date = set(new Date, { y: 2026, mth: 7, d: 12 });
	let week = new Week(date);
	assert.equal(week.number, 33);
	assert.equal(week.prev().number, 32);
	assert.equal(week.next().number, 34);
}

function test_week_iterator() {
  let week = new Week();
  for (const [i, day] of Array.from(week).entries()) {
    if (i == 0)
      assert.describe('First weekday').equal(day.name, 'ma');
    if (i == 6)
      assert.describe('Last weekday').equal(day.name, 'zo');
  }
}

function test_week_offset() {
  let week = new Week();
  let slice = week.offset(0);
  assert.describe('Should be monday').equal(slice[0].name, 'ma');
  slice = week.offset(2);
  assert.describe('Should be wednesday').equal(slice[0].name, 'wo');
}

function test_week_contains() {
  let week = new Week();
  assert.equal(true, week.contains(new Date));
  var foreign_date = adjust(new Date, { mth: 1 });
  assert.equal(false, week.contains(foreign_date));
}

function test_month_min_max() {
	/**
	 * Test minimum date and maximum date of a Month object
	 */
	let month = new Month(MID_OCT);
	assert.equal(month.min.ts, MONTH_MIN); // wed 1 oct
	assert.equal(month.max.ts, MONTH_MAX); // fri 31 oct
}

function test_month_find_weeks_recursive() {
	/**
	 * Test private methods of the Month object
	 * which create a set of corresponding Week objects
	 */
	let month = new Month(MID_OCT, { init: false });
	let week = new Week(MID_OCT);
	let weeks = month._find_prev([week]);
	assert.describe('0').equal(week.number, 42);
	assert.describe('1').equal(weeks[0].number, 40);
	assert.describe('2').equal(weeks[1].number, 41);
	let weeks2 = month._find_next([week]);
	assert.describe('5').equal(weeks2[0].number, 43);
	assert.describe('6').equal(weeks2[1].number, 44);
}

function test_month_next_and_prev() {
	/**
	 * Test next/prev methods of a Month object
	 */
	let oct = new Month(MID_OCT);
	MID_OCT.setMonth(MID_OCT.getMonth() - 1); // Mid sept
	let sep = new Month(MID_OCT);
  let _sep = oct.prev();
	assert.describe('1').equal(_sep.min.ts, sep.min.ts);
	assert.describe('2').equal(oct.prev().max.ts, sep.max.ts);
	MID_OCT.setMonth(MID_OCT.getMonth() + 2); // Mid nov
	let nov = new Month(MID_OCT);
	assert.describe('3').equal(oct.next().min.ts, nov.min.ts);
	assert.describe('4').equal(oct.next().max.ts, nov.max.ts);
}

function test_month_iterator() {}

function test_quarter() {
  let q1 = Quarter.q1();
  let q4 = Quarter.q4();
  assert.describe('q1 index').equal(q1.index, 1);
  assert.describe('q4 index').equal(q4.index, 4);
  assert.describe('q1 starts in jan').equal(q1.min.month, 0);
  assert.describe('q1 ends in mar').equal(q1.max.month, 2);
  assert.describe('q4 starts in oct').equal(q4.min.month, 9);
  assert.describe('q4 ends in dec').equal(q4.max.month, 11);
}

run_test(test_day);
run_test(test_day_is_today);
run_test(test_day_matches);
run_test(test_day_next_and_prev);
run_test(test_week_min_max);
run_test(test_week_num);
run_test(test_week_next_and_prev);
run_test(test_week_iterator);
run_test(test_week_offset);
run_test(test_week_contains);
run_test(test_month_find_weeks_recursive);
run_test(test_month_min_max);
run_test(test_month_next_and_prev);
run_test(test_quarter);

export {};
