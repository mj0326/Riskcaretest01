package app.metatron.extensions.covid.domain.search;

import app.metatron.extensions.covid.domain.storage.unit.ExtractUnit;
import app.metatron.extensions.covid.domain.storage.unit.Granularity;
import com.google.common.collect.Lists;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.Interval;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@NoArgsConstructor
@Getter
public class ChartResponse implements Serializable {

  List<String> categories;

  List<Series> series;

  public ChartResponse(List<Object> result, Granularity granularity, String interval, List<String> seriesNames) {
    this.categories = Lists.newArrayList();
    this.series = Lists.newArrayList();

    timeseriesResults(result, granularity, interval, seriesNames, DateTimeZone.UTC);
  }

  public ChartResponse(List<Object> result, Granularity granularity, String interval, List<String> seriesNames, DateTimeZone dateTimezone) {
    this.categories = Lists.newArrayList();
    this.series = Lists.newArrayList();

    timeseriesResults(result, granularity, interval, seriesNames, dateTimezone);
  }

  public ChartResponse(List<Object> result, ExtractUnit extractUnit, List<String> ranges, List<String> seriesNames) {
    this.categories = Lists.newArrayList();
    this.series = Lists.newArrayList();

    timeExtractResults(result, extractUnit, ranges, seriesNames);
  }

  public void timeseriesResults(List<Object> results, Granularity granularity, String intervalStr,
                                List<String> seriesNames, DateTimeZone dateTimezone) {

    String timeDimName = "t";

    DateTimeFormatter fmt = DateTimeFormat.forPattern(granularity.getPattern()).withZone(dateTimezone);

    Interval interval = Interval.parse(intervalStr);
    DateTime runningDateTime = interval.getStart();
    DateTime endDateTime = interval.getEnd();

    // initialize series
    for (String seriesName : seriesNames) {
      series.add(new Series(seriesName, Lists.newArrayList()));
    }

    for (Object result : results) {
      Map<String, Object> resultMap = (Map<String, Object>) result;

      // category
      String catDateTime = (String) resultMap.get(timeDimName);
      while (!fmt.print(runningDateTime).equals(catDateTime)) {
        categories.add(fmt.print(runningDateTime));

        for (int i = 0; i < seriesNames.size(); i++) {
          Series s = series.get(i);
          s.addData(0.0);
        }

        runningDateTime = granularity.plus(runningDateTime, 1);
      }

      categories.add((String) resultMap.get(timeDimName));

      for (int i = 0; i < seriesNames.size(); i++) {
        Series s = series.get(i);
        s.addData(resultMap.get(s.getLabel()));
      }

      runningDateTime = granularity.plus(runningDateTime, 1);
    }

    while (endDateTime.isAfter(runningDateTime)) {
      categories.add(fmt.print(runningDateTime));

      for (int i = 0; i < seriesNames.size(); i++) {
        Series s = series.get(i);
        s.addData(0.0);
      }

      runningDateTime = granularity.plus(runningDateTime, 1);
    }

  }

  public void timeExtractResults(List<Object> results, ExtractUnit extractUnit, List<String> ranges, List<String> seriesNames) {

    String timeDimName = "t";

    // TBD : extractUnit 별로 range 가 있는데 이것을 토대로 interpolation 해야함
    // extractUnit 이 Hour 인 경우 0~23
    List<Integer> extractRange = interpolationRanges(ranges, extractUnit);
    int startIdx = extractRange.get(0);
    int endIdx = extractRange.get(1);

    // initialize series
    for (String seriesName : seriesNames) {
      series.add(new Series(seriesName, Lists.newArrayList()));
    }

    for (Object result : results) {
      Map<String, Object> resultMap = (Map<String, Object>) result;

      // category
      int dataIdx = (Integer) resultMap.get(timeDimName);
      while (startIdx < dataIdx) {
        categories.add(startIdx + "");

        for (int i = 0; i < seriesNames.size(); i++) {
          Series s = series.get(i);
          s.addData(0.0);
        }
        startIdx++;
      }

      categories.add(dataIdx + "");

      for (int i = 0; i < seriesNames.size(); i++) {
        Series s = series.get(i);
        s.addData(resultMap.get(s.getLabel()));
      }

      startIdx++;

      if(startIdx > endIdx) {
        break;
      }
    }

    while (startIdx < endIdx) {
      categories.add(startIdx + "");

      for (int i = 0; i < seriesNames.size(); i++) {
        Series s = series.get(i);
        s.addData(0.0);
      }
      startIdx++;
    }
  }

  public List<Integer> interpolationRanges(List<String> ranges, ExtractUnit unit) {

    Integer startRange = 0;
    Integer endRange = Integer.MAX_VALUE;

    for (String range : ranges) {
      Interval interval = Interval.parse(range);

      int startValue = unit.getValueByExtraction(interval.getStart());
      if(startRange < startValue) {
        startRange = startValue;
      }

      int endValue = unit.getValueByExtraction(interval.getEnd());
      if(endRange > endValue) {
        endRange = endValue;
      }
    }

    return Lists.newArrayList(startRange, endRange);
  }

  @NoArgsConstructor
  @Getter
  public static class Series {

    /**
     * Label of series
     */
    private String label;

    /**
     * Series data, Assume the same size as the category array.
     */
    private List<Object> data;

    public Series(String label, List<Object> data) {
      this.label = label;
      this.data = data;
    }

    public void addData(Object obj) {
      if (data == null) {
        data = Lists.newArrayList();
      }

      data.add(obj);
    }
  }
}
