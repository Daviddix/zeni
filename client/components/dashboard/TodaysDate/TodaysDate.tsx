
function TodaysDate() {
            const d = new Date();
            const weekday = d.toLocaleDateString(undefined, { weekday: 'long' });
            const day = d.getDate();
            const getOrdinal = (n: number) => {
              const j = n % 10, k = n % 100;
              if (j === 1 && k !== 11) return 'st';
              if (j === 2 && k !== 12) return 'nd';
              if (j === 3 && k !== 13) return 'rd';
              return 'th';
            };
            const month = d.toLocaleDateString(undefined, { month: 'long' });
            const year = d.getFullYear();
            
  return (
    <p>{`${weekday} ${day}${getOrdinal(day)} ${month}, ${year}`}</p>
  )
}

export default TodaysDate