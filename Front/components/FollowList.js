//프로필 페이지의 Follower, Following 리스트의 최적화
import { Button, Card, Icon, List } from "antd";
import React, { memo } from "react";
import PropTypes from "prop-types";

const FollowList = memo(
  ({ header, hasMore, onClickMore, data, onClickStop }) => {
    //중복되는 내용은 그대로 두고 팔로우, 팔로잉에 따라 바뀌는 내용만
    //props로 전달받아 채워준다
    return (
      <List
        style={{ marginBottom: "20px" }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
        header={<div>{header}</div>}
        loadMore={
          hasMore && (
            <Button style={{ width: "100%" }} onClick={onClickMore}>
              더 보기
            </Button>
          )
        }
        bordered
        dataSource={data}
        renderItem={item => (
          <List.Item style={{ marginTop: "20px" }}>
            <Card
              actions={[
                <Icon key="stop" type="stop" onClick={onClickStop(item.id)} />
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />
    );
  }
);

FollowList.displayName = "FollowList";

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onClickMore: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  onClickStop: PropTypes.func.isRequired
};

export default FollowList;
