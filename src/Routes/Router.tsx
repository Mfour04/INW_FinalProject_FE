import { Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/Home/HomePage";
import { NotFound } from "../pages/NotFound";
import { UserProfile } from "../pages/UserProfile/UserProfile";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { Unauthorized } from "../pages/Unauthorized";
import { Roles } from "../context/AuthContext/AuthProvider";
import { NovelsExplore } from "../pages/NovelsExplore/NovelsExplore";
import { LoginNeeded } from "../pages/LoginNeeded";
import { WritingRoom } from "../pages/WritingRoom/WritingRoom";
import { NovelRead } from "../pages/NovelRead/NovelRead";
import { NovelDetail } from "../pages/Chapters/NovelDetail";
import CreateChapters from "../pages/WritingRoom/CreateChapters/CreateChapters";
import { UpsertNovels } from "../pages/WritingRoom/UpsertNovels/UpsertNovels";
import { UpsertChapter } from "../pages/WritingRoom/UpsertChapter/UpsertChapter";
import { Blogs } from "../pages/Blogs/Blogs";
import { Deposite } from "../pages/Deposite/Deposite";
import { TransactionHistory } from "../pages/TransactionHistory/TransactionHistory";
import { NovelLib } from "../pages/Following/NovelLib/NovelLib";
import { Setting } from "../pages/setting/Setting";
import { TestUserProfile } from "../pages/UserProfile/TestUserProfile";
import AdminHome from "../pages/Admin/AdminHome";
import UserList from "../pages/Admin/UserManagement/UserList";
import RequestList from "../pages/Admin/RequestMangement/RequestList";
import ReportList from "../pages/Admin/ReportMangement/ReportList";
import NovelList from "../pages/Admin/NovelManagement/NovelList";
import TransactionList from "../pages/Admin/TransactionMangement/TransactionList";
import { ReadingProcess } from "../pages/Following/ReadingProcess/ReadingProcess";
import AboutUs from "../pages/Info/AboutUs";
import Contact from "../pages/Info/Contact";
import Rules from "../pages/Info/Rules";
import Terms from "../pages/Info/Terms";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/terms" element={<Terms />} />
      <Route
        path="/following"
        element={<ProtectedRoutes role={[Roles.User]} />}
      >
        <Route index element={<NovelLib />} />
        <Route path="library" element={<NovelLib />} />
        <Route path="history" element={<ReadingProcess />} />
      </Route>
      <Route path="/novels">
        <Route index element={<NovelsExplore />} />
        <Route path=":novelId" element={<NovelDetail />} />
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
      <Route path="/admin" element={<ProtectedRoutes role={Roles.Admin} />}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UserList />} />
        <Route path="novels" element={<NovelList />} />
        <Route path="transaction" element={<TransactionList />} />
        <Route path="reports" element={<ReportList />} />
        <Route path="wallets" element={<RequestList />} />
      </Route>
      {/* <Route path="/novelRead" element={<NovelRead />} /> */}
      <Route path="/deposite" element={<Deposite />} />
      <Route path="/transaction-history" element={<TransactionHistory />} />
      <Route path="/profile" element={<ProtectedRoutes role={[Roles.User]} />}>
        <Route index element={<UserProfile />} />
      </Route>
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/test-profile" element={<TestUserProfile />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/needlogin" element={<LoginNeeded />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};
