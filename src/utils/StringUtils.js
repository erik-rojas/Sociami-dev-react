let StringUtils = {
  trim(original, limit) {
    if (original.length < limit) {
      return original;
    }

    let trimmed = original.substr(0, limit);
    trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));

    if (trimmed.length < original.length) {
      trimmed += '...';
    }

    return trimmed;
  },
};

export default StringUtils;
