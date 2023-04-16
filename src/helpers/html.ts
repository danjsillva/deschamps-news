import dayjs from "dayjs";

const getDate = (html: string) => {
  let dates;

  dates = html.match(/\d{1,2} [A-z]{1,} \d{4}/g) || [];

  if (dates.length) {
    return dayjs(dates[0], "D MMMM YYYY", "en").format("YYYY-MM-DD");
  }

  dates = html.match(/[A-z]{1,} \d{1,2}(st|nd|th), \d{4}/g) || [];

  if (dates.length) {
    return dayjs(
      dates[0].replace("st,", "").replace("nd,", "").replace("th,", "")
    ).format("YYYY-MM-DD");
  }

  return null;
};

const getBatches = (html: string) => {
  return html.match(/<blockquote.*?<\/blockquote>/gs) || [];
};

const getParagraphs = (html: string) => {
  return (
    html
      .replace(/ class=\".*?\"/gm, "")
      .replace(/ style=\".*?\"/gm, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/<span> <\/span>/gim, " ")
      .replace(/<br>/gi, "")
      .replace(/<p><strong><\/strong><\/p>/gim, "")
      .match(/<p>.*?<\/p>/gs) || []
  );
};

const getText = (html: string) => {
  return html.replace(/(<([^>]+)>)/gi, "");
};

export default { getDate, getBatches, getParagraphs, getText };
