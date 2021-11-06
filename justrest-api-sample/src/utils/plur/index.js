const plur = ({ count, singular, plural, showCount = true }) => {
  const usesInlineCount =
    singular.includes("{count}") || plural.includes("{count}");
  const word = Math.abs(count) === 1 ? `${singular}` : `${plural}`;
  if (showCount && !usesInlineCount) {
    return `${count} ${word}`;
  }

  return word.replace("{count}", count);
};

module.exports = plur;
