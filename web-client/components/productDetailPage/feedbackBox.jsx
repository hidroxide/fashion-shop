import { useQuery } from "@tanstack/react-query";

import FeedbackItem from "@/components/productDetailPage/feedbackItem";
import queries from "@/queries/index.js";
import { memo } from "react";

const FeedbackBox = ({ productId }) => {
  const { isError, error, data } = useQuery({
    ...queries.products.feedbackList(productId),
    enabled: !!productId,
  });
  if (isError) console.log(error);
  const feedbackList = data?.data;

  return (
    <div className="feedback-box row">
      {feedbackList &&
        feedbackList.map((feedback, index) => {
          return (
            <FeedbackItem
              key={index}
              customer={feedback.customer}
              rate={feedback.rate}
              colour={feedback.colour}
              size={feedback.size}
              content={feedback.content}
              createdAt={feedback.created_at}
            />
          );
        })}
    </div>
  );
};

export default memo(FeedbackBox);
