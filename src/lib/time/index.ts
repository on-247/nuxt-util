import { getWeek } from "date-fns";

const MOD_NAME = "NUTIL/TIME";

export function clone(d1: Date) {
  return new Date(d1.getTime())
}

export function adjust(d1: Date, options: any) {
  if ('h' in options) {
    d1.setHours(d1.getHours() + options.h)
  }
  if ('m' in options) {
    d1.setMinutes(d1.getMinutes() + options.m)
  }
  if ('s' in options) {
    d1.setSeconds(d1.getSeconds() + options.s)
  }
  if ('ms' in options) {
    d1.setMilliseconds(options.ms)
  }
  return d1
}

export function set(d1: Date, options: any) {
  if ('h' in options) {
    d1.setHours(options.h);
  }
  if ('m' in options) {
    d1.setMinutes(options.m);
  }
  if ('s' in options) {
    d1.setSeconds(options.s);
  }
  if ('ms' in options) {
    d1.setMilliseconds(((options.ms == 0 || !!options.ms) && typeof options.ms == 'number') ? options.ms : 0);
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
  return d1
}

export function to_date(ts_or_date: number | Date) {
	if (typeof ts_or_date !== "number") {
		return ts_or_date;
	}
	let d = new Date();
	d.setTime(ts_or_date * 1000);
  set(d, {ms: 0});
	return d;
}

export function to_ts(d1: Date | number) {
  if (typeof d1 === 'number') {
    return d1;
  }
  return Math.round(d1.getTime() / 1000);
}

export function equals_date(d1: Date, d2: Date) {
  return d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate()
}

export class Day {
	date: Date;
  _ts: number;

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
		date.setMilliseconds(0);
    this.date = date;
    let _date = new Date(date.getTime())
		_date.setHours(0);
		_date.setMinutes(0);
		_date.setSeconds(0);
		_date.setMilliseconds(0);
    this._ts = Math.floor(_date.getTime() / 1000)
	}

  static from_ts(ts: string | number) {
    let ts_ = Number(ts)
    return new Day(new Date(ts_ * 1000))
  }

	get ts() {
    return this._ts
	}

	get name() {
		let i = this.date.getDay() == 0 ? 7 : this.date.getDay();
		try {
			Day.NAMES[i];
		} catch (e) {
			throw new Error(`[${MOD_NAME}] Could not determine day name`);
		}
		return Day.NAMES[i] || "";
	}

	get is_today() {
		let now = new Date();
		now.setHours(0);
		now.setMinutes(0);
		now.setSeconds(0);
		now.setMilliseconds(0);
		return Math.round(now.getTime() / 1000) == this.ts;
	}

  get month() {
    return this.date.getMonth()
  }

  /** @UNCOVERED */
  prev() {
   return new Day(new Date((this.ts - Day.HOURS) * 1000)); 
  }

  /** @UNCOVERED */
  next() {
   return new Day(new Date((this.ts + Day.HOURS) * 1000)); 
  }
}

export class Week {
	_days: Record<number, Day>;
  _number?: number

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
		let local_weekday = rdate.getDay();
		let local_date = rdate.getDate();
		for (let day_index of [1, 2, 3, 4, 5, 6, 7]) {
			let diff = day_index - (local_weekday || 7);
			let weekday_date = new Date();
			weekday_date.setFullYear(rdate.getFullYear());
			weekday_date.setMonth(rdate.getMonth());
			weekday_date.setDate(local_date + diff);
			yield { i: day_index, date: weekday_date };
		}
	}

	day(index: number) {
		if (1 < index && index > 7) {
			throw new Error(`[${MOD_NAME}] Day index ${index} out of range`);
		}
		let day = this._days[index] || new Day;
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
      return this._number
    }
    return this._number = getWeek(this.min.date, { weekStartsOn: 1 });
	}

	next() {
		let last = this.max.date;
		let d = new Date(last.getTime());
		d.setDate(last.getDate() + 1);
		return new Week(d);
	}

	prev() {
		let last = this.min.date;
		let d = new Date(last.getTime());
		d.setDate(last.getDate() - 1);
		return new Week(d);
	}

	/** @UNCOVERED */
	*[Symbol.iterator]() {
		for (const day of Object.values(this._days)) {
			yield day;
		}
	}

	/** @UNCOVERED */
	offset(offset: number) {
		return Object.values(this._days).slice(offset);
	}

	/** @UNCOVERED */
  contains(d1: Date) {
    for (var day of Object.values(this._days)) {
      if (equals_date(d1, day.date)) {
        return true
      }
    }
    return false;
  }
}

export class Month {
	_weeks: Week[];
	index: number;

	constructor(relative: Date = new Date(), options = { init: true }) {
		this._weeks = [];
		this.index = relative.getMonth();
		if (options.init) {
			this.init({ relative });
		}
	}

	init(
		options: { relative: Date; week?: Week } | { relative?: Date; week: Week },
	) {
		if (options?.relative && options?.week) {
			throw new Error(
				`[${MOD_NAME}] Value error: cannot set both relative date and week entrypoint`,
			);
		}
		let start = options.relative ? new Week(options.relative) : options.week;
		if (!start) {
			throw new Error(
				`[${MOD_NAME}] Value error: must set either relative date or week entrypoint`,
			);
		}
		let prev_weeks: Week[] = [];
		prev_weeks = this._find_prev([start]);
		prev_weeks.pop();
		this._weeks = [...prev_weeks, ...this._find_next([start])];
	}

	_find_prev(weeks: Week[]): Week[] {
		let pointer = weeks[0];
		if (pointer == null) {
			throw new Error(`[${MOD_NAME}] Value error: empty week pointer value`);
		}
		let prev_week = pointer.prev();
		if (
			prev_week.min.month === this.index ||
			prev_week.max.month === this.index
		) {
      weeks.unshift(prev_week)
			return this._find_prev(weeks);
		}
		return weeks;
	}

	_find_next(weeks: Week[]): Week[] {
		if (weeks.length - 1 < 0) {
			throw new Error(`[${MOD_NAME}] Value error: no weeks`);
		}
		let pointer = weeks[weeks.length - 1];
		let next_week = pointer.next();
		if (
			next_week.min.month === this.index ||
			next_week.max.month === this.index
		) {
      weeks.push(next_week)
			return this._find_next(weeks);
		}
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
			if (week_min.day(index).date.getMonth() === this.index) {
				return week_min.day(index);
			}
		}
		return {
      _ts: 0,
			ts: 0,
			name: "nvt",
			date: new Date(),
			is_today: false,
      month: 0,
      prev() {return this},
      next() {return this},
		};
	}

	get max(): Day {
		if (this._weeks.length - 1 < 0) {
			throw new Error(`[${MOD_NAME}] Value error: no weeks`);
		}
		let week_max = this._weeks[this._weeks.length - 1];
		for (const index of [7, 6, 5, 4, 3, 2, 1]) {
			if (week_max.day(index).date.getMonth() === this.index) {
				return week_max.day(index);
			}
		}
		return {
      _ts: 0,
      ts: 0,
      name: "nvt",
      date: new Date(),
      is_today: false,
      month: 0,
      prev() {return this},
      next() {return this},
		};
	}

	get today() {
		for (let week of this._weeks) {
      try {
        return week.today
      }
      catch {
        continue
      }
		}
		throw new Error(`[${MOD_NAME}] Today not inside month context`);
	}

  get name() {
    var names: any = {
      0: 'Jan',
      1: 'Feb',
      2: 'Mrt',
      3: 'Apr',
      4: 'Mei',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Okt',
      10: 'Nov',
      11: 'Dec'
    }
    return names[this.index] as string
  }

	prev(): Month {
		let min = this.min.date;
		let d = new Date(min.getTime());
		d.setDate(min.getDate() - 1);
		let m = new Month(d, { init: false });
		let shared_week = this._weeks[0];
		if (shared_week == null) {
			throw new Error(`[${MOD_NAME}] Value error: no weeks`);
		}
		if (
			shared_week.min.date.getMonth() !== this.index &&
			shared_week.max.date.getMonth() === this.index
		) {
			m.init({ week: shared_week });
		} else {
			m.init({ relative: d });
		}
		return m;
	}

	next(): Month {
		let max = this.max.date;
		let d = new Date(max.getTime());
		d.setDate(max.getDate() + 1);
		let m = new Month(d, { init: false });
		let shared_week = this._weeks[this._weeks.length - 1];
		if (shared_week == null) {
			throw new Error(`[${MOD_NAME}] Value error: no weeks`);
		}
		if (
			shared_week.min.date.getMonth() === this.index &&
			shared_week.max.date.getMonth() !== this.index
		) {
			m.init({ week: shared_week });
		} else {
			m.init({ relative: d });
		}
		return m;
	}
}
