import { useRouteError, Link } from 'react-router-dom';

function ErrorFallback() {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

  return (
    <div role="alert">
      <p>문제가 발생했습니다.</p>
      <pre>{message}</pre>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
}

export default ErrorFallback;
