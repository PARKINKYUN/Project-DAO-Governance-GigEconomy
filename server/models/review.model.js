const mongoose = require("mongoose");

const review = new mongoose.Schema({
  review_id: {
    type: Number,
  },
  worker_id: {
    type: String,
  },
  order_id: {
    type: Number,
  },
  content: {
    type: String,
    required: true,
  },
});

//리뷰 조회(worker_id조회)
review.statics.getReviewByworkerId = async (worker_id) => {
  return await this.find({ worker_id: worker_id });
};

//리뷰 조회(order_id조회)
review.statics.getReviewByorderId = async (order_id) => {
  return await this.find({ order_id: order_id });
};

//리뷰 생성
review.methods.saveReview = async (obj, idx) => {
  const newReview = new this({
    worker_id: obj.worker_id,
    order_id: obj.order_id,
    content: obj.content,
    review_id: idx,
  });
  return await newReview.save();
};

//리뷰 수정
review.statics.setReview = async (review_id, content) => {
  return await this.findOneAndUpdate(
    { review_id: review_id },
    { content: content },
    { new: true }
  );
};

//리뷰 삭제
review.statics.removeReview = async (review_id) => {
  await this.findByIdAndRemove(review_id);
};

module.exports = mongoose.model("Review", review);