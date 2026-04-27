const MOD_NAME = "BACKEND/TIME";

export function clone(d1: Date) {
	return new Date(d1.getTime());
}

export function adjust(d1: Date, options: any) {
	if ("h" in options) {
		d1.setHours(d1.getHours() + options.h);
	}
	if ("m" in options) {
		d1.setMinutes(d1.getMinutes() + options.m);
	}
	if ("s" in options) {
		d1.setSeconds(d1.getSeconds() + options.s);
	}
	if ("ms" in options) {
		d1.setMilliseconds(d1.getMilliseconds() + options.ms);
	}
  if ('y' in options) {
		d1.setFullYear(d1.getFullYear() + options.y);
  }
  if ('mth' in options) {
		d1.setMonth(d1.getMonth() + options.mth);
  }
  if ('d' in options) {
		d1.setDate(d1.getDate() + options.d);
  }
	return d1;
}

export function set(d1: Date, options: any) {
	if ("h" in options) {
		d1.setHours(options.h);
	}
	if ("m" in options) {
		d1.setMinutes(options.m);
	}
	if ("s" in options) {
		d1.setSeconds(options.s);
	}
	if ("ms" in options) {
		d1.setMilliseconds(
			(options.ms == 0 || !!options.ms) && typeof options.ms == "number"
				? options.ms
				: 0,
		);
	}
  if ('y' in options) {
		d1.setFullYear(options.y);
  }
  if ('mth' in options) {
		d1.setMonth(options.mth);
  }
  if ('d' in options) {
		d1.setDate(options.d);
  }
	return d1;
}

export function to_date(ts_or_date: number | Date) {
	if (typeof ts_or_date !== "number") {
		return ts_or_date;
	}
	let d = new Date();
	d.setTime(ts_or_date * 1000);
	return set(d, { ms: 0 });
}

export function to_ts(d1: Date | number) {
	if (typeof d1 === "number") {
		return d1;
	}
	set(d1, { ms: 0 });
	return Math.round(d1.getTime() / 1000);
}

export function same_date(d1: Date, d2: Date) {
	return d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate();
}

const MTH_TO_DAYS: number[] = [
  31, 59, 90,
  120, 151, 181,
  212, 243, 273,
  304, 334, 365
];

MTH_TO_DAYS[-1] = 0;

export function get_week(obj: Date | number) {
  var date = to_date(obj);
  const year = date.getFullYear();
  const jan1 = set(new Date, {y: year, mth: 0, d: 1, h: 4, m: 0, s: 0, ms: 0 });
  const jan1_wd = jan1.getDay() == 0 ? 7 : jan1.getDay(); // @ts-ignore
  var year_day = MTH_TO_DAYS[date.getMonth() - 1] + date.getUTCDate();
  year_day += jan1_wd > 4 ? 6 - jan1_wd : jan1_wd - 1
  var is_leap = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
  if (is_leap) {
    year_day += 1;
  }
  var rw = Math.ceil(year_day / 7);
  return rw == 53 && !is_leap ? 1 : rw;
}

export class Day {
	date: Date;
	_min = 0;
	_max = 0;

	static get HOURS() {
		return 86400;
	}

	static get NAMES(): Record<number, string> {
		return {
			1: "ma",
			2: "di",
			3: "wo",
			4: "do",
			5: "vr",
			6: "za",
			7: "zo",
		};
	}

	constructor(date: Date = new Date()) {
		this.date = set(date, { ms: 0 });
	}

	static from_ts(ts: number) {
		return new Day(to_date(ts));
	}

	get ts() {
    return this.min;
	}

  get min() {
    if (!this._min) {
      this._min = to_ts(set(clone(this.date), { h: 0, m: 0, s: 0, ms: 0 }));
    }
		return this._min;
  }

	get max() {
    if (!this._max) {
      this._max = to_ts(set(clone(this.date), { h: 23, m: 59, s: 59, ms: 0 }));
    }
		return this._max;
	}

	get name() {
		let i = this.date.getDay() == 0 ? 7 : this.date.getDay();
		try {
			return Day.NAMES[i];
		} catch (e) {
			throw new Error(`[${MOD_NAME}] Could not determine day name`);
		}
	}

	get is_today() {
		return to_ts(set(new Date, { h: 0, m: 0, s: 0, ms: 0 })) == this.ts;
	}

  get year() {
    return this.date.getFullYear();
  }

	get month() {
		return this.date.getMonth();
	}

  get week() {
    return get_week(this.min + 7200);
  }

  get date_() {
    return this.date.getDate();
  }

	prev() {
		return Day.from_ts(this.min - (7200 * 2));
	}

	next() {
		return Day.from_ts(this.max + (7200 * 2));
	}

	matches(day: Date | Day | number) {
    if (day instanceof Date) {
      var c = clone(day);
      set(c, { h: 0, m: 0, s: 0, ms: 0 });
      return to_ts(c) == this.ts;
    }
    if (typeof day === 'number') {
      var ts = Number(day);
      return ts >= this.ts && ts <= this.max;
    }
    day.min != this.min
      ? console.log(`[${MOD_NAME}]`, this.min, '!=', day.min)
      : console.log(`[${MOD_NAME}]`, this.min, '==', day.min);
		return day.min == this.min;
	}
}

export class Week {
	_days: Record<number, Day>;
	_number?: number;

	constructor(relative: Date = new Date()) {
		this._days = [];
		this._init(relative);
	}

	_init(relative: Date) {
		for (const { i, date } of this._get_week_dates(relative)) {
			this._days[i] = new Day(date);
		}
	}

	/**
	 * @UNCOVERED
	 *
	 * Yields a day of a week on each iteration, allowing you to create a list
	 * of weekdays based on any given date of any intended week
	 */
	*_get_week_dates(rdate: Date) {
		/** @NOTE UTC Date functions return bare UTC dates, not local UTC dates */
		var local_weekday = rdate.getDay();
		var local_date = rdate.getDate();
    var weekday_base_date = clone(rdate);
		for (var day_index of [1, 2, 3, 4, 5, 6, 7]) {
			let diff = day_index - (local_weekday || 7);
			let weekday_date = clone(weekday_base_date);
			weekday_date.setDate(local_date + diff);
			yield { i: day_index, date: weekday_date };
		}
	}

	day(index: number) {
		let day = this._days[index];
		if (1 < index && index > 7 || !day) {
			throw new Error(`[${MOD_NAME}] Day index ${index} out of range`);
		}
		return day;
	}

	get min() {
		return this.day(1);
	}

	get max() {
		return this.day(7);
	}

	get today() {
		for (let day of Object.values(this._days)) {
			if (day.is_today) {
				return day;
			}
		}
		throw new Error(`[${MOD_NAME}] Today not inside week context`);
	}

	get number() {
		if (this._number) {
			return this._number;
		}
		return (this._number = get_week(this.min.date));
	}

	prev() {
    return new Week(clone(this.min.prev().date));
	}

	next() {
		return new Week(clone(this.max.next().date));
	}

	*[Symbol.iterator]() {
		for (const day of Object.values(this._days)) {
			yield day;
		}
	}

	offset(offset: number) {
		return Object.values(this._days).slice(offset);
	}

	contains(d1: Date) {
		for (var day of Object.values(this._days)) {
			if (same_date(d1, day.date)) {
				return true;
			}
		}
		return false;
	}

  /** @UNCOVERED */
  replace(nw: Week) {
    var counter = 1;
    for (const day of nw) {
      this._days[counter] = day;
      counter++;
    }
    this._number = nw.number;
  }
}

export class Month {
	_weeks: Week[];
	index: number;
	_days: Day[] = [];

	constructor(relative: Date = new Date(), options = { init: true }) {
		this._weeks = [];
		this.index = relative.getMonth();
		if (options.init) {
			this.init({ relative });
		}
	}

  get year() {
    return this.min.date.getFullYear();
  }

	init(
		options: { relative: Date; week?: Week } | { relative?: Date; week: Week },
	) {
		if (options?.relative && options?.week) {
			throw new Error(
				`[${MOD_NAME}] Value error: cannot set both relative date and week entrypoint`,
			);
		}
		var start = options.relative ? new Week(options.relative) : options.week;
		if (!start) {
			throw new Error(
				`[${MOD_NAME}] Value error: must set either relative date or week entrypoint`,
			);
		}
		this._weeks = [...this._find_prev([start]), start, ...this._find_next([start])];
	}

	_find_prev(weeks: Week[], tries=0): Week[] {
		var pointer = weeks[0];
		if (!pointer) {
			throw new Error(`[${MOD_NAME}] Value error: empty week pointer value`);
		}
    if (tries > 100) {
			throw new Error(`[${MOD_NAME}] Month._find_prev Recursion detected`);
    }
		var prev_week = pointer.prev();
		if (
			prev_week.min.month === this.index ||
			prev_week.max.month === this.index
		) {
			weeks.unshift(prev_week);
			return this._find_prev(weeks, tries + 1);
		}
    weeks.pop();
		return weeks;
	}

	_find_next(weeks: Week[], tries=0): Week[] {
		var pointer = weeks[weeks.length - 1];
		if (!pointer) {
			throw new Error(`[${MOD_NAME}] Value error: empty week pointer value`);
		}
    if (tries > 100) {
			throw new Error(`[${MOD_NAME}] Month._find_next Recursion detected`);
    }
		var next_week = pointer.next();
		if (
			next_week.min.month === this.index ||
			next_week.max.month === this.index
		) {
			weeks.push(next_week);
			return this._find_next(weeks, tries + 1);
		}
    weeks.shift();
		return weeks;
	}

	/** @UNCOVERED */
	*[Symbol.iterator]() {
		for (let week of this._weeks) {
			yield week;
		}
	}

	get min(): Day {
		if (!this._weeks.length) {
			throw new Error(`[${MOD_NAME}] Value error: no weeks`);
		}
		let week_min = this._weeks[0];
		for (const index of [1, 2, 3, 4, 5, 6, 7]) {
			if (week_min.day(index).month === this.index) {
				return week_min.day(index);
			}
		}
		return {
			_min: 0,
			_max: 0,
			ts: 0,
			min: 0,
			max: 0,
			name: "nvt",
			date: new Date(),
			is_today: false,
			month: 0,
      year: 0,
      date_: 0,
      next() {
        return this;
      },
      prev() {
        return this;
      },
      matches(day: any) {
        return false;
      }
		};
	}

	get max(): Day {
		if (this._weeks.length - 1 < 0) {
			throw new Error(`[${MOD_NAME}] Value error: no weeks`);
		}
		let week_max = this._weeks[this._weeks.length - 1];
		for (const index of [7, 6, 5, 4, 3, 2, 1]) {
			if (week_max.day(index).month === this.index) {
				return week_max.day(index);
			}
		}
		return {
			_min: 0,
			_max: 0,
			ts: 0,
			min: 0,
			max: 0,
			name: "nvt",
			date: new Date(),
			is_today: false,
			month: 0,
      year: 0,
      date_: 0,
      next() {
        return this;
      },
      prev() {
        return this;
      },
      matches(day: any) {
        return false;
      }
		};
	}

  /** @UNCOVERED */
	get today() {
		for (let week of this._weeks) {
			try {
				return week.today;
			} catch {
				continue;
			}
		}
		throw new Error(`[${MOD_NAME}] Today not inside month context`);
	}

  /** @UNCOVERED */
	get name() {
		var names: any = {
			0: "Jan",
			1: "Feb",
			2: "Mrt",
			3: "Apr",
			4: "Mei",
			5: "Jun",
			6: "Jul",
			7: "Aug",
			8: "Sep",
			9: "Okt",
			10: "Nov",
			11: "Dec",
		};
		return names[this.index] as string;
	}

	prev(): Month {
    return new Month(clone(this.min.prev().date));
	}

	next(): Month {
    return new Month(clone(this.max.next().date));
	}

  /** @UNCOVERED */
	get days() {
		if (!this._days.length) {
			this._days = this._weeks.map((w) => [...w]).flat();
		}
		return this._days;
	}

  /** @UNCOVERED */
	week(index = 0) {
		return this._weeks[index];
	}

  /** @UNCOVERED */
	day(index = 0) {
		return this.days[index];
	}

  /** @UNCOVERED */
  replace(nm: Month) {
    this._weeks.splice(0);
    this._weeks.push(...nm._weeks);
    this.index = nm.index;
    this._days.splice(0);
  }
}

const Y = (new Date).getFullYear();
export class Quarter {
  _months: Month[];
  constructor(months: Month[]) {
    this._months = months;
    var pointer = months[0];
    months.push(new Month(set(new Date, { y: pointer.min.year, mth: pointer.min.month + 1 })));
    months.push(new Month(set(new Date, { y: pointer.min.year, mth: pointer.min.month + 2 })));
  }

  /** @UNCOVERED */
  static current() {
    var pointer = new Date;
    var index = pointer.getMonth();
    set(new Date, { mth: (index >= 0 && index < 3) ? 0 : (index >= 3  && index < 6) ? 3 : (index >= 6  && index < 9) ? 6 : (index >= 9  && index < 11) ? 9 : null });
    var months = [new Month(pointer)];
    return new Quarter(months);
  }

  static q1(y=Y) {
    var months = [new Month(set(new Date, { y, mth: 0 }))];
    return new Quarter(months);
  }

  static q2(y=Y) {
    var months = [new Month(set(new Date, { y, mth: 3 }))];
    return new Quarter(months);
  }

  static q3(y=Y) {
    var months = [new Month(set(new Date, { y, mth: 6 }))];
    return new Quarter(months);
  }

  static q4(y=Y) {
    var months = [new Month(set(new Date, { y, mth: 9 }))];
    return new Quarter(months);
  }

  /** @UNCOVERED */
  get year() {
    return this._months.at(0)?.min.year || 0;
  }

  get index() {
    var pointer = this._months.at(0)?.min.month || 0;
    switch(pointer) {
      case 0:
        return 1;
      case 3:
        return 2;
      case 6:
        return 3;
      case 9:
        return 4;
    }
  }

  get min() {
    var obj = this._months.at(0);
    if (!obj) throw new Error('Quarter.min');
    return obj.min;
  }

  get max() {
    var obj = this._months.at(-1);
    if (!obj) throw new Error('Quarter.min');
    return obj.max;
  }

  /** @UNCOVERED */
  get month() {
    var def = this._months[0];
    var NOW_MONTH = (new Date).getMonth();
    for (var i=this._months.length-1; i--;) {
      var obj = this._months[i];
      if (obj.index == NOW_MONTH) {
        return obj;
      }
    }
    if (!def) {
      throw new Error(`[DEBUG] default month nonexistent.`)
    }
    return def;
  }

  /** @UNCOVERED */
  prev() {
    var touch = this.min?.prev() || new Day();
    if (touch.year !== this.min?.year) {
      return new Quarter([new Month(set(clone(touch.date), { mth: 9 }))]);
    }
    var p = set(clone(touch.date), { mth: touch.month - 2 });
    return new Quarter([new Month(p)]);
  }

  /** @UNCOVERED */
  next() {
    var touch = this.max?.next() || new Day();
    if (touch.year !== this.max?.year) {
      return new Quarter([new Month(set(clone(touch.date), { y: touch.year, mth: 0 }))])
    }
    var p = set(clone(touch.date), { mth: touch.month });
    return new Quarter([new Month(p)])
  }

  /** @UNCOVERED */
  includes(month: Month) {
    if (month.year !== this.year) {
      return false;
    }
    var zero = this._months.at(0);
    var minus_one = this._months.at(-1);
    if (!(zero && minus_one)) {
      throw new Error('Invalid quarter');
    }
    return month.index >= zero.index && month.index <= minus_one.index;
  }
}
