import React from "react";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import { abbreviateTimeUnits } from "utilities/helpers";

import TooltipWrapper from "components/TooltipWrapper";

const baseClass = "component__last-updated-text";

const renderLastUpdatedText = (
  lastUpdatedAt: string,
  whatToRetrieve: string
): JSX.Element => {
  if (!lastUpdatedAt || lastUpdatedAt === "0001-01-01T00:00:00Z") {
    lastUpdatedAt = "never";
  } else {
    lastUpdatedAt = abbreviateTimeUnits(
      formatDistanceToNowStrict(new Date(lastUpdatedAt), {
        addSuffix: true,
      })
    );
  }

  return (
    <span className={baseClass}>
      <TooltipWrapper
        tipContent={`Fleet periodically queries all hosts to retrieve ${whatToRetrieve}`}
      >
        {`Updated ${lastUpdatedAt}`}
      </TooltipWrapper>
    </span>
  );
};

export default renderLastUpdatedText;
