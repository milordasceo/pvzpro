import { useState, useEffect, useCallback } from 'react';
import { BreakSession } from './shift.store';

interface UseShiftTimerProps {
    isShiftOpen: boolean;
    shiftStartTime: number | null;
    shiftEndTime: string; // "21:00"
    breaks: BreakSession[];
}

interface ShiftTimerState {
    timer: string;           // "04:32:15"
    timerShort: string;      // "04:32"
    remainingTime: string;   // "3ч 45м"
    breakTimer: string;      // "08:45"
    activeBreak: BreakSession | undefined;
}

export const useShiftTimer = ({
    isShiftOpen,
    shiftStartTime,
    shiftEndTime,
    breaks,
}: UseShiftTimerProps): ShiftTimerState => {
    const [timer, setTimer] = useState('00:00:00');
    const [remainingTime, setRemainingTime] = useState('--:--');
    const [breakTimer, setBreakTimer] = useState('00:00');

    const activeBreak = breaks.find((b) => b.status === 'active');

    // Shift timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isShiftOpen && shiftStartTime) {
            interval = setInterval(() => {
                const now = Date.now();
                const diff = now - shiftStartTime;

                const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setTimer(`${h}:${m}:${s}`);

                // Calculate remaining time
                const [endH, endM] = shiftEndTime.split(':').map(Number);
                const endTime = new Date();
                endTime.setHours(endH, endM, 0, 0);
                if (endTime.getTime() < now && diff < 3600000) {
                    endTime.setDate(endTime.getDate() + 1);
                }

                const rem = endTime.getTime() - now;
                if (rem > 0) {
                    const rh = Math.floor(rem / 3600000);
                    const rm = Math.floor((rem % 3600000) / 60000);
                    setRemainingTime(`${rh}ч ${rm}м`);
                } else {
                    setRemainingTime('Завершена');
                }
            }, 1000);
        } else {
            setTimer('00:00:00');
            setRemainingTime('--:--');
        }

        return () => clearInterval(interval);
    }, [isShiftOpen, shiftStartTime, shiftEndTime]);

    // Break timer
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (activeBreak && activeBreak.startTime) {
            interval = setInterval(() => {
                const now = Date.now();
                const elapsedMs = now - activeBreak.startTime!;
                const limitMs = activeBreak.durationLimit * 60 * 1000;
                const remainingMs = limitMs - elapsedMs;

                if (remainingMs <= 0) {
                    setBreakTimer('00:00');
                    return;
                }

                const m = Math.floor(remainingMs / 60000).toString().padStart(2, '0');
                const s = Math.floor((remainingMs % 60000) / 1000).toString().padStart(2, '0');
                setBreakTimer(`${m}:${s}`);
            }, 1000);
        } else {
            setBreakTimer('00:00');
        }

        return () => clearInterval(interval);
    }, [activeBreak]);

    return {
        timer,
        timerShort: timer.split(':').slice(0, 2).join(':'),
        remainingTime,
        breakTimer,
        activeBreak,
    };
};
