import React, { useState } from "react";
import { Form, Button, message, Modal } from "antd";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

import { Review } from "./types/shared";

const initialReviews: Review[] = [
  {
    id: 1,
    title: "Awesome rocket",
    rocketName: "Saturn V",
    description: "I loved everything about this rocket!",
    githubUsername: "elonmusk",
  },
  {
    id: 2,
    title: "Not so good",
    rocketName: "Falcon Heavy",
    description: "It was a bit disappointing, to be honest.",
    githubUsername: "nasa",
  },
];

const App = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = (newReview: Review) => {
    setReviews([...reviews, newReview]);

    setModalVisible(false);
    message.success("Review added successfully");
  };

  const handleEdit = (id: number) => {
    const review = reviews.find((r) => r.id === id);
    if (review) {
      form.setFieldsValue(review);
      setModalVisible(true);
    }
  };

  const handleDelete = (id: number) => {
    setReviews(reviews.filter((r) => r.id !== id));
    message.success("Review deleted successfully");
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div className="App">
        <h1>List of Rockets</h1>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Add Review
        </Button>
        <Modal
          title="New Rocket"
          open={modalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <ReviewForm
            form={form}
            onSubmit={handleAdd}
            onCancel={handleCancel}
          />
        </Modal>
        <ReviewList
          reviews={reviews}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default App;
