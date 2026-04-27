# Digital Wellness Showcase Checklist

Use this checklist to track the work needed to align the repo with the requested Digital Wellness showcase requirements.

## 1. Project Setup
- [x] Confirm the app is running from the cloned Git repository.
- [x] Review the existing frontend and backend structure before making changes.
- [x] Identify the current upload, authentication, and gallery code paths.

## 2. Frontend and Design
- [x] Keep the interface minimalistic.
- [x] Update the visual theme to use blue tones across the platform.
- [x] Make the landing page clearly present a drop option for submissions.
- [x] Ensure the design works cleanly on desktop and mobile.

## 3. Authentication and Access Control
- [ ] Make sign-in determine the user’s role before granting access.
- [ ] Allow only IIITN students enrolled in the DW course with a valid BT ID to submit projects.
- [ ] Block submission access for faculty, staff, and external students.
- [ ] Route non-student users to the gallery view after login.

## 4. Submission Types
- [x] Support website submissions.
- [x] Support video submissions.
- [x] Support photo submissions.
- [x] Store enough metadata to distinguish submission type and ownership.

## 5. Website Showcase
- [x] Build a way to embed submitted websites directly inside the platform.
- [x] Verify embedded websites render safely and responsively.

## 6. Gallery Features
- [x] Add a functional video player for video submissions.
- [x] Render image submissions properly in the gallery.
- [x] Show previous DW work for users without submission access.
- [x] Keep the gallery usable as a browse-first experience.

## 7. Upload Handling
- [x] Increase the server upload file size limit significantly.
- [x] Confirm the upload pipeline can handle very large videos.
- [x] Verify the chosen storage approach can support multi-GB files.

## 8. Validation
- [x] Test student login with BT ID submission access.
- [x] Test non-student login and confirm gallery-only access.
- [x] Test website, video, and photo submissions end to end.
- [x] Test large file uploads and gallery playback/display.
- [x] Confirm the landing page drop option is visible and usable.

## 9. Delivery
- [x] Update documentation if any environment variables or setup steps change.
- [x] Record any deployment or storage limits that affect production use.