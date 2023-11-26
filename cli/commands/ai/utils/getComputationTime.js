const getComputationTime = (startDate, endDate) => {
  const dif = startDate.getTime() - endDate.getTime();

  const Seconds_from_T1_to_T2 = dif / 1000;
  const Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
  return Seconds_Between_Dates;
};

module.exports = getComputationTime;
