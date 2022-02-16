import { useMemo } from "react";
import { useParams, useLocation } from "react-router-dom/cjs/react-router-dom.min";
function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}
export default useQuery;
