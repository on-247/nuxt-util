import {ulid} from 'ulid'
import type { GenericCallback } from '../util'
import { isClient } from '../util'

type NBTimerMember = {
  id: string;
  callback: GenericCallback
  priority: number
  ms: number
  ticks_start: number;
  on: boolean
}

var ticks = 0
var tick_ms = 16.67
var then = 0
var members: NBTimerMember[] = []
function NBTimer(options?: any) {
  // window.nbt = NBTimer
  const nbt = {
    add(callback: GenericCallback, options: any) {
      var obj = {
        id: ulid(),
        on: true,
        callback,
        ms: options?.ms ?? 1,
        ticks_start: Number(ticks),
        priority: options?.priority ?? 0
      }
      members.push(obj)
      members.sort((a, b) => a.priority - b.priority)
      return {
        remove: () => nbt.remove(obj.id),
        on: () => obj.on = true,
        off: () => obj.on = false,
      }
    },
    remove(id: string) {
      for (var [i, {id: m_id}] of members.entries()) {
        if (m_id == id) {
          members.splice(i, 1);
          return;
        }
      }
    },
    raf: (now: number) => {
      if ((!tick_ms || tick_ms < 3) && then && now) {
        console.log(now, then, now - then)
        tick_ms = (now - then) / 10
        console.log('Now and then ', now, then, 'Ticks ms set to', tick_ms)
      }
      ticks += 1
      for (let member of members) {
        if (!member.on) {
          continue
        }
        if (member.ms == 1 || Math.ceil((ticks - member.ticks_start) * tick_ms) >= member.ms) {
          member.callback(then, now)
          if (member.ms != 1) {
            member.ticks_start = ticks
          }
        }
      }
      if (ticks > 999999) {
        ticks = 0
      }
      then = now
      requestAnimationFrame(nbt.raf)
    }
  }
  requestAnimationFrame(nbt.raf)
  return nbt
}

if (!isClient) console.warn('NBTimer currently is client-only')

export default isClient && NBTimer()