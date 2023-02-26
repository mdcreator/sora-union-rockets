import React, { useState } from "react";
import { Card, Form, Input, Button, AutoComplete, Avatar } from "antd";
import { debounce } from "lodash";
import axios from "axios";
import { Review } from "./types/shared";

interface ReviewFormProps {
  form: any;
  onSubmit: (review: Review) => void;
  onCancel: () => void;
  initialValues?: Review;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [autocompleteOptions, setAutocompleteOptions] = useState<any[]>([]);

  const searchUsers = async (query: string) => {
    try {
      const response = await axios.get(
        `https://api.github.com/search/users?q=${query}`
      );
      setAutocompleteOptions(response.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedSearchUsers = debounce(searchUsers, 500);

  const onSearch = (value: string) => {
    if (value.length >= 3) {
      debouncedSearchUsers(value);
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const review: Review = {
        id: initialValues ? initialValues.id : Date.now(),
        title: values.title,
        rocketName: values.rocketName,
        description: values.description,
        githubUsername: values.githubUsername,
      };
      onSubmit(review);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <div>
      <Card title="Add Review">
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="rocketName"
            label="Rocket Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="githubUsername" label="Github Username">
            <AutoComplete
              options={autocompleteOptions.map((option: any) => ({
                value: option.login,
                label: (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={option.avatar_url}
                      size="small"
                      style={{ marginRight: "10px" }}
                    />
                    <span>{option.login}</span>
                  </div>
                ),
              }))}
              onSearch={onSearch}
              placeholder="Search for Github user"
              filterOption={(inputValue: string, option: any) =>
                option!.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleOk}>
              {initialValues ? "Save" : "Create"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
export default ReviewForm;
