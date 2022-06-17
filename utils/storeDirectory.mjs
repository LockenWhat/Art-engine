import { NFTStorage, File } from 'nft.storage'
import { getFilesFromPath } from 'files-from-path'
console.log('test 1 passed!')
console.log('test 2 passed!')
console.log('test 3 passed!')
console.log('test 4 passed!')
console.log('Directing to storing your files to the IPFS...')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZmREJDOUMzNDE0OTMxRjQ3RmYzYjNFZTA1YTJjNUZjM0JhNjAzYUQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDg2NzY5MTQ5NCwibmFtZSI6IlRlc3RpbmdUcmFkZXJzIn0.ndS1D6Q7mGCJadhIBDdH0zcHVIgqizgUCQF_FcIMYxk'

async function main() {
  const basePath = process.argv.slice(2)
  const files = await getFilesFromPath(`C:/Users/Vedant/OneDrive/Desktop/hashlips_art_engine-main (1)/hashlips_art_engine-main/build/json`)

  const storage = new NFTStorage({ token })

  console.log(`storing ${files.length} file(s) from ${basePath}`)
  const cid = await storage.storeDirectory(files, {
      pathPrefix: basePath, 
      hidden: true 
  })
  console.log({ cid })

  const status = await storage.status(cid)
  console.log(status)
}
main()














