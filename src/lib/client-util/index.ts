
export const getSeatMap = (seatStr: string) => {
    const m = seatStr.match(/(.*?)-SECC-(.*?)-ASTO-*(.*)/);
    if (!m) {
        return {
            seatType: null,
            section: null,
            seat: null,
        };
    }
    const mappedSeat = {
        seatType: m?.length > 1 ? m[1] : null,
        section: m?.length > 2 ? m[2] : null,
        seat: m?.length > 3 ? m[3] : null,
    };
    console.log('mappedSeat', mappedSeat);
    return mappedSeat;
};
