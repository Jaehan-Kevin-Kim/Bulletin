import { IDM } from '@typings/db';
import React, { VFC } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import { Scrollbars } from 'react-custom-scrollbars';
import regexifyString from 'regexify-string';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user = data.Sender;

  //정규표현식 사용 //@[test1](2)
  // \d는 숫자, +는 1개 이상, ?는 0개 이상, .는 모든 글자, g는 모두 찾기
  // @[test]12](7)
  // 아래의 문법을 보고 위에 예시를 검색한다고 했을 때, 만약 +만 쓰면 test]12 이렇게 찾음. 그런데 +?로 쓰면 test만 찾음. (+는 1개 이상이면서 최대한 많이 찾고, +?는 1개 이상이면서 최대한 적게 찾음.)
  const result = regexifyString({
    pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
    decorator(match, index) {
      const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
      if (arr) {
        console.log(arr);
        return (
          <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
            @{arr[1]}
          </Link>
        );
      }
      return <br key={index} />;
    },
    input: data.content,
  });

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
