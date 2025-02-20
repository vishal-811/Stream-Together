-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT,
    "videoUploaderId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_id_key" ON "Video"("id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_videoUploaderId_fkey" FOREIGN KEY ("videoUploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
