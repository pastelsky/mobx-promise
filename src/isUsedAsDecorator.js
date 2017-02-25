export default function isUsedAsDecorator(args) {
  console.log(typeof args[0], typeof args[1], typeof args[2])
  return args.length === 3 &&
    typeof args[1] === 'string' &&
    typeof args[2] === 'object' &&
    'value' in args[2]
}
