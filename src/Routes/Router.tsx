import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { NotFound } from "../pages/NotFound";
import { UserProfile } from "../pages/userProfile/UserProfile";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { Unauthorized } from "../pages/Unauthorized";
import { Roles } from "../context/AuthContext/AuthProvider";
import { Novels } from "../pages/Novels/Novels";
import { LoginNeeded } from "../pages/LoginNeeded";
import { WritingRoom } from "../pages/WritingRoom/WritingRoom";
import { NovelRead } from "../pages/novelRead/NovelRead";
import { Chapters } from "../pages/Chapters/Chapters";
import CreateChapters from "../pages/WritingRoom/CreateChapters/CreateChapters";
import { UpsertNovels } from "../pages/WritingRoom/UpsertNovels/UpsertNovels";
import { UpsertChapter } from "../pages/WritingRoom/UpsertChapter/UpsertChapter";
import { Blogs } from "../pages/Blogs/Blogs";
export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/following"
        element={<ProtectedRoutes role={[Roles.User]} />}
      >
        <Route index element={<></>} />
        <Route path=":id" element={<></>} />
        <Route path="new" element={<></>} />
      </Route>
      <Route path="/novels">
        <Route index element={<Novels />} />
        <Route path=":novelId" element={<Chapters />} />
        <Route path=":novelId/:chapterId" element={<NovelRead />} />
        <Route
          path="writing-room"
          element={<ProtectedRoutes role={[Roles.User]} />}
        >
          <Route index element={<WritingRoom />} />
          <Route path="upsert-novel/:id?" element={<UpsertNovels />} />
          <Route path=":novelId" element={<CreateChapters />} />
          <Route
            path=":novelId/upsert-chapter/:chapterId?"
            element={<UpsertChapter />}
          />
        </Route>
      </Route>
      <Route
        path="/admin"
        element={<ProtectedRoutes role={Roles.Admin} />}
      ></Route>
      {/* <Route path="/novelRead" element={<NovelRead />} /> */}
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/needlogin" element={<LoginNeeded />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};
