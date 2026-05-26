export function StudioLayout(props: any) {
  return (
    <>
      {props.renderDefault(props)}
      <style>{`
        [role="tablist"] {
          gap: 6px !important;
        }

        [role="tab"] {
          min-height: 32px !important;
          padding: 7px 12px !important;
          border: 1px solid transparent !important;
          border-radius: 0 !important;
          color: #595650 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          opacity: 1 !important;
        }

        [role="tab"]:hover {
          border-color: #d4d0c7 !important;
          background: #f1f0eb !important;
          color: #111111 !important;
        }

        [role="tab"][aria-selected="true"] {
          border-color: #111111 !important;
          background: #111111 !important;
          color: #fbfaf7 !important;
        }

        [role="tab"]:focus-visible {
          outline: 2px solid #111111 !important;
          outline-offset: 2px !important;
        }
      `}</style>
    </>
  )
}
