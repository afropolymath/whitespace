import styled from 'styled-components';

const StyledLoadingText = styled.div`
  display: inline-flex;
  align-items: center;
  color: #989898;
`;
export const Loader = ({ loadingText }: { loadingText?: string }) => {
  return (
    <StyledLoadingText>
      <i className='ri-loader-4-line rotating'></i>
      {loadingText && <h4>{loadingText}</h4>}
    </StyledLoadingText>
  );
};
